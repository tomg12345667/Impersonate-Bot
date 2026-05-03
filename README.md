# Discord Impersonation Bot
*Orginally made & owned by Alex-VOIP (https://github.com/Alex-VOIP)

## What is this Bot?
**NOTICE:** This bot is a Discord Bot that is hosted on *your own hardware.* If you are in the **RingNet** Discord Server, this Bot may be available to you, if you do not have the restriction on your account. 
This bot creates a Discord Webhook with the Current User's Profile/Nickname. This Bot will then send the message, and delete the Webhook immediately. 
The webhook will show as an (APP) so The user will know the impersonation bot is used.

## How do I set it up on my own hardware?
To set this bot up on your own hardware, you will first need to gain permission from myself or Alex-VOIP (https://github.com/Alex-VOIP) via the Discord Direct Messing Feature. Our Usernames are:
Tom: tommy01020304
Alex: that.alex.fr
Once you gain permission, follow the following steps:
First, run: ```git clone https://github.com/tomg12354667/Impersonate-Bot.git```. This will pull the latest updates and firmware. 

Then, insure npm is installed, and run ```npm install```. 

Once everything syncs together, go to discord.com/developer/applications, and create a new bot. Grab your Token and keep it safe. **DO NOT SHARE THIS TOKEN WITH ANYBODY.**

Now, run the command ```nano .env.example```
Enter your Discord Bot Token, it may look something similar to this: ```MTQ5NjcwNDE2MTYyOTM0Mzg1NA.GVUCOJ.y7iAhG4rmPtlpuyWunJARhAuqVamlhX2n-Qgog``` ( ## THIS BOT TOKEN HAS BEEN SHUT DOWN/RESET. YOU ARE UNABLE TO USE IT. )
Next, you will need your Client ID. You can find that under OAuth2.
# DO NOT CHANGE THE PORT. 
After all info is filled in, click Left-Ctrl, and X, and then hit Y.
Then hit enter.
Once all this is done, go into ```nano .env.example``` again. 
## In the file, hit Left-Ctrl, and O, and backspace .example, then hit enter. Hit Y to save under a different name, then use Left-Ctrl, X. 
**REMINDER: ENSURE ALL DEPENDENCYS ARE IN THE SERVER. IF NOT, YOU WILL RECIEVE AN ERROR WHEN BOOTING UP.**
Once you get all information in .env, run ```node start.js``` this will boot up all services.

# TIPS:
To change your portal password, or to find your portal password, run ```nano portal.js```
Your password will be ```password123```, and your username will be ```admin```

If you want no members to be able to access this, create a role named "Impersonation Block". Then add it into the "Blocked Roles". Insure you do not give the Server owner or you this.

Remember to install the Newest Node.js! (Version 20)
```curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -```
```sudo apt install -y nodejs```


