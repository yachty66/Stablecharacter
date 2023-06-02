import interactions

bot = interactions.Client(token="MTExMjU1NTYzMjU0NjA0MTg5Ng.G8oodP.f7rccXDaTjm_jYLJpNoj1XFfYGknIG4KN1UD8U")

@interactions.slash_command(
    name="my_first_command",
    description="This is the first command I made!",
    #scope=1114168386105131138,
)
async def my_first_command(ctx: interactions.ComponentContext):
    await ctx.send("Hi there!")

bot.start()






'''import discord
from discord.ext import commands


intents = discord.Intents.all()

class MyBot(commands.Bot):
    def __init__(self, command_prefix, **options):
        super().__init__(command_prefix, intents=intents, **options)

        # Initialize an empty dictionary to store user configurations
        # In a real application, you might replace this with a database
        self.user_configs = {}

    async def on_ready(self):
        print('on_ready was called')
        print(f'We have logged in as {self.user}')

    async def configure(self, user_id, name, age, gender, personality):
        # Store the configuration in the dictionary
        self.user_configs[user_id] = {'name': name, 'age': age, 'gender': gender, 'personality': personality}

    async def get_config(self, user_id):
        # Get the configuration for a specific user
        return self.user_configs.get(user_id)

bot = MyBot(command_prefix='!')

@bot.command()
async def configure(ctx, name: str, age: int, gender: str, personality: str):
    print("triggered")
    # Configure the bot
    await bot.configure(ctx.message.author.id, name, age, gender, personality)
    await ctx.send(f"Bot configured! Name: {name}, Age: {age}, Gender: {gender}, Personality: {personality}")
    
@bot.event
async def on_command_error(ctx, error):
    if isinstance(error, commands.CommandError):
        await ctx.send(f'An error occurred: {str(error)}')


bot.run('MTExMjU1NTYzMjU0NjA0MTg5Ng.G8oodP.f7rccXDaTjm_jYLJpNoj1XFfYGknIG4KN1UD8U')'''
