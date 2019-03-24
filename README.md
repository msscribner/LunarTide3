If AWS set up (1: EC2 Instance hosting Website 2: RDS w/SQL Server) go to 
    Step 5.  Setting Up Node and NPM
    Step 6.  Install LunarTide Website
    Step 8:  Set Up Port Forwarding
    Step 9a: Setting up MS-SQL

    



Step 1:  Create AWS EC2 Instance:
	a. Navigate to EC2	
	b. Press the 'Launch Instance' button
	c. Choose an Amazon Machine Image (AMI)
	d. Choose an Instance Type 
    	And press the 'Next: Configure Instance Details' button	
	e. Configure Instance Details
		Just take the default settings.  
		Press the 'Next: Add Storage' button
	f. Add Storage
		Just take the default settings.  
		Press the 'Next: Add Tags' button
	g. Add Tags
		Just take the default settings.  
		Press the 'Next: Configure Security Group' button
	h. Configure Security Group
		Set up the Rules to have an HTTP, SSH, HTTPS and Custom TCP Rule:
		
		Http:            Port:80     Source:0.0.0.0 /0
        SSH:             Port:22     Source:0.0.0.0 /0
		HTTPS:           Port:443    Source:0.0.0.0 /0
        Custom TCP Rule: Port: 1337  Source 0.0.0.0 /0
	
	i. Press 'Review and Lunch' button
	j. Press 'Launch' button
	k. Select an existing Key Pair or Create a new Key Pair
	
	Need to select the acknowledge checkbox before pressing the 'Launch Instances' button.
	    l. Press the 'View Instances' button.   All EC2 Instances will display:
		
		
Step 2: Managing the Instance
	a. Give Instance a name.  
	b. Instance Description
		1. Security Groups
		2. Public DNS
		3. Private DNS
	c. Update the Security Groups
		Select the Security Group link associated with this instance (press 'launch-wizard-5') 
		Or
		Select the Security Groups link link under Network & Security
			
		Then select the Inbound or Outbound tabs to modify the Rules
		


Step 3:  Connect to EC2 using SSH from Windows
    https://support.cloudshark.io/kb/ssh-to-aws-windows.html
    https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/putty.html?icmpid=docs_ec2_console


	1. Convert Private Key using PuTTYgen
	2. Using PuTTY
		Create New Session:  
			Saved Sessions:  Ubuntu3
		Press Save
	3. Select Connection -> SSH -> Auth
	4. Browse to the Private Key file saved in Step1
	5. Select Session
	6. Value the Host Name  
	(Public DNS (IPv4) for the EC2 Instance you are connecting to.
	7. Press Open button
	8. Logon using the password ubuntu


	• For Amazon Linux 2 or the Amazon Linux AMI, the user name is ec2-user.
	• For a Centos AMI, the user name is centos.
	• For a Debian AMI, the user name is admin or root.
	• For a Fedora AMI, the user name is ec2-user or fedora.
	• For a RHEL AMI, the user name is ec2-user or root.
	• For a SUSE AMI, the user name is ec2-user or root.
	• For an Ubuntu AMI, the user name is ubuntu.


Step 4:  SSH from Mac
	From a Terminal:
	Ssh -I LunarTide.pem ubuntu@[ec2 instance IP]
	For example:
	Ssh -I LunarTide.pem ubuntu@[ec2-18-222-143-167.us-east-2.compute.amazonaws.com]
	

Step 5:   Setting Up Node and NPM
    https://medium.com/@nishankjaintdk/setting-up-a-node-js-app-on-a-linux-ami-on-an-aws-ec2-instance-with-nginx-59cbc1bcc68c
    https://sqlchoice.azurewebsites.net/en-us/sql-server/developer-get-started/node/ubuntu/

    https://websiteforstudents.com/install-the-latest-node-js-and-nmp-packages-on-ubuntu-16-04-18-04-lts/

	a. Add Node.js PPA
		sudo apt install curl
	b. Install the LTS release
		curl -sL https://deb.nodesource.com/setup_8.x | sudo bash -
	c. Install Node.js and NPM
		sudo apt install nodejs
	d. Verify
		node -v
    npm -v
		
		
Step 6. Install LunarTide Website
	a. Create Folder c:\nodedev
	b. git clone https://github.com/msscribner/LunarTide.git
	c. Cd \LunarTide
	d. Npm update
	e. Npm start
	f. http://ec2-18-222-143-167.us-east-2.compute.amazonaws.com:1337/index#!/index

	• Where: ec2-18-222-143-167.us-east-2.compute.amazonaws.com is the Public DNS (IPv4) for the EC2 Instance running the Website.
	• Where 1337 is the port the Website is configured to use.


Step 7.  Start/Stop EC2 Instance
	a. Select Instance
	b. Dropdown the Actions button
	c. Select Instance State
	d. Select Start or Stop



Step 8:  Set Up Port Forwarding:
	https://medium.com/@nishankjaintdk/setting-up-a-node-js-app-on-a-linux-ami-on-an-aws-ec2-instance-with-nginx-59cbc1bcc68c
	Search for: Move the app to port 80 (not really)
	
	Install NGINX:  
		sudo apt-get update
		sudo apt-get install nginx
	
	Verify NGINX is running:
		service nginx  status
		Browse using Public DNS (IPv4) for the EC2 Instance running the Website.
		For example:  http://ec2-3-16-123-209.us-east-2.compute.amazonaws.com/
	
	· Update the NGINX.CONF file:
		· sudo nano /etc/nginx/nginx.conf
		
		NOTE:  Be careful to NOT update the entries at the top of the document. 
	
		· Add the following entries:
			server {
				listen                 80 default_server;
				listen                 [::]:80 default_server;
				server_name   localhost;
				root                   /usr/share/nginx/html;
			          location / {
			               proxy_pass http://127.0.0.1:3000;
			               proxy_http_version 1.1;
			               proxy_set_header Upgrade $http_upgrade;
			               proxy_set_header Connection 'upgrade';
			               proxy_set_header Host $host;
			               proxy_cache_bypass $http_upgrade;
			              }
			       }
			
		NOTE:  The Server Block MUST be nested inside the HTTP block.
			
		· Remove/Comment out the following entries:
			#       include /etc/nginx/sites-enabled/*;
	
		· Verify the nginx.conf is valid:
			sudo nginx -t
	
		· Browse to Website
		http://ec2-3-16-123-209.us-east-2.compute.amazonaws.com/index#
	
		· How to Manage the NGINX service
		sudo  service nginx start
		sudo service nginx stop
		sudo service nginx restart
		
		· How to remove NGINX  https://askubuntu.com/questions/235347/what-is-the-best-way-to-uninstall-nginx
		sudo apt-get remove nginx nginx-common # Removes all but config files.
		sudo apt-get purge nginx nginx-common # Removes everything.
		sudo apt-get autoremove # After using any of the above commands, use this in order to remove dependencies used by nginx which are no longer required.
		
	
	
		
Step 9:  Setting up MS-SQL
	https://aws.amazon.com/getting-started/tutorials/create-microsoft-sql-db/
	
	    No Need to follow Step 3…unless you don't have SSMS. 
	
	
	a. Update server.js 
		user: 	"MasterUser"
		password: 	"hurricane"
		server: 	"masterdbinstance.ceb5gc48z2v4.us-east-2.rds.amazonaws.com"
		database: 	"LunarTide"
	
	
	b. Create the Database
      Use SSMS
	  Server Name: masterdbinstance.ceb5gc48z2v4.us-east-2.rds.amazonaws.com,1433
	

	

http://ec2-3-16-123-209.us-east-2.compute.amazonaws.com:/index#!/index
http://ec2-3-16-123-209.us-east-2.compute.amazonaws.com:1337/index#!/index
