Documentation for Doctorify 

Doctorify is a AI platform that connects patients with our Professionally Trained AI based Doctor . Our streamlined interface facilitates instant virtual consultations while maintaining high standards of medical care

Account SetUp :
Paypal : You need to have an paypal account
Log into your account
Go to developer Dashboard
Click on API credentials
Create APP
Get the Client Id 
Clerk : You need to create account on clerk.com
Get into the platform
Click on create application
Get the env keys 
Supabase : Create account on supabase 
Get into the platform
Create a organisation , then create a project inside the organisation
Then create a table , name it usersubscriptions with this columns such as user_id, status , plan_type , payment_id , amount
After creating the table , create policy for that table
Now, go to project setting < data api and then get the project url and project anon key
Vapi : Create account in vapi
Get into the platform
Click on assistant, then click on create assistant 
Add the necessary prompt along with knowledge pds
Then publish the assistant and copy the assistant id
Also make sure to go to Org settings , then click on API keys and copy the public and private keys

Groq : Create an account in Groq
Get into the platform
Click on api keys
Create your api key and copy it


Project Setup and Run it Locally 

Steps : 
Go to pricing page , replace the given paypal client id with your created one also replace the supabase project url and anon keys
Now go to doctors page , replace all the assistant id with your created assistant ids
Again go to call-page replace the given vapi public key with your one
Next go to api route and replace the given api key with your one
Now, if you are using vs code then open a new terminal
Run “ npm install “ and then “ npm run dev “
The project will open in localhost:3000 where you can try it out


Project Deployment 

Steps : 
First create a github repository 
Then inside your project root folder, open a new terminal run this command “ git init “
Then all the rest of the commands will be given while creating your github repository so just copy and paste those commands and deploy your project to github first 
Then , create a account on vercel by connecting with your github account
Click on add new , choose project and then select the created github repository
Give name and click on env variable and add the clerk env file as it is example : 

Finally click on deploy for deploying the project 


That’s it 


link: https://docs.google.com/document/d/1dGyxSWhCPbmYiwVstR3h2CnqyV9gYLWFR0KTx8TQroA/edit?usp=sharing