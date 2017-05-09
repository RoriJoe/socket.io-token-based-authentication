const    _  = require('lodash'),
      jwt = require('jsonwebtoken');



const func = (socket,data) => {
    return new Promise((resolve, reject) => {
                
                verifyConnection(socket,data);
    });
};

exports.verifyConnection = func;

const verifyConnection = function(socket, data) {

    var token = data && data.token || null;

    if(!socket || socket==='undefined' || !clients[socket.id] || !token)
    {
        console.log('Unauthorized access: access denied');
        message.sendError(socket,'Invalid email or password');  
      
        socket.disconnect();
        reject(false);
    }
    
    if (token) 
    {
   
        jwt.verify(token, jwtSecret, function(err, decoded) 
        {
            if (err) 
            {
             
                console.log(err);
                 message.sendError(socket,'Invalid email or password');
                
                    socket.disconnect();
                reject(false);
             }


            let userID = decoded.id;
         
             let user = _.find(users,{id:userID});
             console.log('founded user',user);
             if(!user) {
                         console.log('!user:false');
                         message.sendError(socket, 'Invalid email or password');
                         
                          socket.disconnect();
                          reject(false);
                         }
                  else {  
                            console.log('user:true'); 
                            resolve(true);}

         });
    }
    
};


const func2 = (socket,data) => {
    return new Promise((resolve, reject) => {
      
       verifyConnectionAuth0(socket,data);

    });
};



exports.verifyConnectionAuth0 = func2;

exports.verifyConnectionAuth0 = function(socket, data) {

   
    var token = data && data.token || null;
   

     if(!socket || socket==='undefined' || !clients[socket.id] || !token)
    {
        console.log('Unauthorized access: access denied');
        message.sendError(socket,'Invalid email or password');  
        
           socket.disconnect();
      reject(false);
    }
    
    if (token) 
    {
   
        jwt.verify(token, jwtSecret, function(err, decoded) 
        {
            if (err) 
            {
               console.log(err);
                 message.sendError(socket,'Invalid email or password');
                  
                    socket.disconnect();
               reject(false);
             }


            let auth0UserID = decoded.sub;
         
        
        
             let user = _.find(users,{auth0_user_id:auth0UserID});
              
             if(!user) {
                         message.sendError(socket, 'Invalid email or password');
                         
                            socket.disconnect();
                        reject(false);
                         }
                  else { 
                       
                        resolve(true);
                    }

         });
    };
    
};

exports.authenticateUser = function authenticateUser (socket, data) {

  const {email,password}=data;
  
  
  if(!email || !password)   return message.sendError(socket,'Invalid email or password');

    const user = _.find(users,{email:email,password:password});
   
    
    if(!user) {
        return message.sendError(socket,'Invalid email or password');
    }
     else
            {
                    return loginUser(socket, user);
            }
   
};


const loginUser = function loginUser(socket, user) {

    var profile = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      id: user.id
    };

   
   //expiresIn: expressed in seconds or a string describing a time span zeit/ms. Eg: 60, "2 days", "10h", "7d"
    var token = jwt.sign(profile, jwtSecret, {
      expiresIn: 360
    });

  var data =  {profile: profile, token:token};
    socket.emit('login.success', data);
   
    clients[socket.id]=data;
    //clients[token]=data;
    console.log('User logged to socket.io. number of authorized connections:',NumberOfConnections());
     console.log('User profile logged to socket.io=',profile);

   
    return;

  
};





