## Installation 

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

## Tests

For now we only have manual tests. Major things to check after big updates:
 
- chat is getting transferred from non to login area

## Todo 

- make the page hardcore focused on the 5 love languages test - 
- check the test itself doest have any bugs and its up to date and all works -
    - in the end change the "chat about results button with the "
- make the test result page sharable so that folks can share the test
- upsell the person which is doing the test by adding a link to a group chat for 9$ 

