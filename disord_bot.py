import discord
from discord import option

bot = discord.Bot()

@bot.slash_command(name="chat", guild_ids=[1114168386105131138])
@option(
    "user_name",
    str,
    description="Enter your name"
)
@option(
    "user_gender",
    str,
    description="Enter your gender"
)
@option(
    "bot_name",
    str,
    description="Enter bot's name"
)
@option(
    "bot_age",
    int,
    description="Enter bot's age"
)
@option(
    "bot_gender",
    str,
    description="Enter bot's gender"
)
@option(
    "bot_personality",
    str,
    description="Enter bot's personality"
)
async def chat_command(
    ctx, 
    user_name: str,
    user_gender: str,
    bot_name: str,
    bot_age: int,
    bot_gender: str,
    bot_personality: str
):
    await ctx.respond(f"Received your details! Name: {user_name}, Gender: {user_gender}. I am {bot_name}, a {bot_age} year old {bot_gender} bot with a {bot_personality} personality.")


bot.run("MTExMjU1NTYzMjU0NjA0MTg5Ng.G8oodP.f7rccXDaTjm_jYLJpNoj1XFfYGknIG4KN1UD8U")