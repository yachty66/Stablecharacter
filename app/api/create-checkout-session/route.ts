import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST!, {
  apiVersion: "2024-11-20.acacia",
});

//4242 4242 4242 4242
export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID_TEST!,
          quantity: 1,
        },
      ],
      mode: "subscription", // Changed to subscription since it's a recurring payment
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?payment_success=true`,
      cancel_url: process.env.NEXT_PUBLIC_SITE_URL,
      customer_email: session.user.email,
      metadata: {
        userEmail: session.user.email,
      },
    });

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