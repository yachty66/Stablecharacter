import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

//4242 4242 4242 4242
export async function POST(request: Request) {
  try {
    // Next.js requires awaiting cookies() in route handlers
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const { product } = await request.json();

    // Authentication is OPTIONAL for checkout (no registration required)
    const userEmail = session?.user?.email;

    // Determine the price ID and mode based on the product
    let priceId: string;
    let mode: "payment" | "subscription";
    let successUrl: string;

    if (product === "love_languages_premium") {
      // Love Languages Premium Package - one-time payment
      if (!process.env.STRIPE_LOVE_LANGUAGES_PRICE_ID) {
        return NextResponse.json(
          { error: "Missing STRIPE_LOVE_LANGUAGES_PRICE_ID env var" },
          { status: 400 }
        );
      }
      priceId = process.env.STRIPE_LOVE_LANGUAGES_PRICE_ID!;
      mode = "payment";
      successUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/love-languages-test/success?session_id={CHECKOUT_SESSION_ID}`;
    } else {
      // Default subscription product
      if (!process.env.STRIPE_PRICE_ID) {
        return NextResponse.json(
          { error: "Missing STRIPE_PRICE_ID env var" },
          { status: 400 }
        );
      }
      priceId = process.env.STRIPE_PRICE_ID!;
      mode = "subscription";
      successUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?payment_success=true`;
    }

    const metadata: Record<string, string> = { product: product || "default" };
    if (userEmail) metadata.userEmail = userEmail;

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode,
      allow_promotion_codes: true,
      success_url: successUrl,
      cancel_url: process.env.NEXT_PUBLIC_SITE_URL!,
      metadata,
    };

    // Only include customer_email if we have one (guests can still pay)
    if (userEmail) {
      sessionParams.customer_email = userEmail;
    } else {
      // Ask Stripe to create a Customer for guest checkout
      sessionParams.customer_creation = "always";
    }

    const stripeSession = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({
      url: stripeSession.url,
      sessionId: stripeSession.id,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Error creating checkout session" },
      { status: 500 }
    );
  }
}
