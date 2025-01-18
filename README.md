## Installation 

Based on the provided codebase, I'll create a step-by-step guide for setting up the project locally. Here's what someone needs to do:

### 1. Prerequisites
- Node.js installed
- Python installed

### 2. Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/yachty66/Stablecharacter.git
cd Stablecharacter
```

2. **Install Node.js dependencies**
```bash
npm install
```

3. **Install Python dependencies**
From the requirements.txt file (lines 1-4), they need to run:
```bash
pip install -r requirements.txt
```

4. **Environment Setup**

Ask yachty66 for the data for the env file

5. **Running the Development Server**
Based on the package.json (lines 6-9), there are two ways to run the project:

```bash
# Run both frontend and backend concurrently
npm run dev
```

!!! Attention also the dev mode is connected to the supabase database which is the same as the production database.


-------------


model we are using is gemini/gemini-2.0-flash-exp, rate limits are documented here https://ai.google.dev/gemini-api/docs/models/gemini#gemini-2.0-flash


- [ ] simple system where user can choose between 32 mbti options
- [ ] after the user has send 3 messages in current session he has to login with google to continue (for now no paywall in order to build the product well)
- [ ] store messages in db 
- [ ] make it pretty and ship

alright so right now there are no persistent chats. i would like to make a new user interface for the case a user is logged in. it basically should show all the chats on the left side and the current chat in the main field like its the case if you open a chat app in the browser. how can we do this

- make ads on reddit (should take the spend 500$ get 500$ offer) and enable reddit auth to trace the signups from reddit and then chat with them
- go through all of the feedback in reddit and implement each of the points in the feedback into the app
- enable anime version characters in the same color styles like the real mbti types
    - might need to finetune img gen models here 
- enable photos in the chat (this is closely related to the previous point)
- build a monetanization feature, something like $9,99 a month - could include for example the previous points, ie you can get images if you pay 9.99$ bucks
- store the chats on the left side of the chat
- make an IOS app - for humans its most natural to have a chat via ios app, thats just the natural way how humans are chatting
- rebrand to klons.ai and choose the stick figure with black background as an profile image
- restructure codebase (700 lines in page.tsx is def to long)

a few things i am considering to add is a way to track retention of a user and another thing is to make user upgrade to upgrade to paid plan at a combined of 20 messages maybe

- [ ] make a way to track retention
- [ ] find a good number of total messages send for monetanisation
- [ ] add anime characters to the app 

top prio list of features i have to implement:

i do wanna add a paywall at 20 total messages send to be able to make some cash

- user retention
- make commercial after 20 messages 
- make reddit marketing
- make reddit ads 

before getting into marketing and probably getting dozens of new user i should figure out how to handle the case

i probably need to do some kind of marketing for that stuff now. the question is what is the best way of doing marketing for this now. i probably can do some kind of 


bugs to tackle in the project:

- when user uses chat in landing page interface happens and he logs in after this the chat is not getting transferred
- its possible that the same type appears in the notifications sidebar

todo for SEO and backlinks:

- make a page for each of the types and do at the bottom of it provide a link to the mbti chat
- add a mbti test and in the end forward user to chat about the results

for the test what 

for the integration of the big five test i need to have the test and thne 

1. get the data for the personality test
2. figure what happens in the end when the user is finishing the test, ie how is going to be linked to the chat in the end
3. figure out how i have to deploy it for optimal SEO results
4. wrap it up and share it with people on reddit

things i wanna implement:

- personality database (ai version)?
- add functionality to send voice messages via the chat
- add function so that the bot can send voice message too
- function for reading image 
- function for sending image

the personality data

- after one message was send switch into chat in sidebar mode (no saving in sb yet only when login)
- adjust landing page to claude style 
- make landing pretty and add logo on too also 