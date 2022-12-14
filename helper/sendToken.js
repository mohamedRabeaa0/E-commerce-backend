//////////////all token function for app/////////////////

const nodemailer 	   = require('nodemailer')
const jwt 	         = require('jsonwebtoken');
const crypto         = require('crypto')
const EmailToken     = require('../models/EmailToken')
const PassResetToken = require('../models/PassResetToken')

////////////send email function configuration/////////////////
async function sendEmail (email, subject, text) {

      try {
      	const transporter = nodemailer.createTransport({

      	      host: process.env.HOST,
      		service: process.env.SERVECE,
      		port: Number(process.env.EMAIL_PORT),
      		secure: Boolean(process.env.SECURE),
      		auth: {
      			user: process.env.USER,
      			pass: process.env.APP_PASS,
      		},
      	});

      	await transporter.sendMail({

      		from: process.env.USER,
      		to: email,
      		subject: subject,
      		text: text
      	});


	} catch (error) {

		return res.status(400).json(error)
	}
};


/////////send token email to user to confirm signup////////////
exports.VerfiyToken = async (action, id, route, email) => {

      try{
            //send token to user email to signup
            if (action == 'Verify Email') {

                  //create token in database model
                  const token = await new EmailToken({
                        userId: id,
                        token: crypto.randomBytes(32).toString("hex")
                  })

                  await token.save();
                  
                  //create route contain token
                  const url = `${process.env.BASE_URL}api/auth/${id}/${route}/${token.token}`;

                  //send route to user email
                  sendEmail(email, action, url);

            //send token to reset password incase forget password      
            } else if (action == 'Reset Password') {

                  //check if token exist in database
                  let token = await PassResetToken.findOne({userId: id});

                  //create token in DB incase notfund token in DB
                  if (!token) {
                        token = await new PassResetToken({
                        userId: id,
                        token: crypto.randomBytes(32).toString("hex")
                        }).save();
                  }
                  
                  //create route contain token
                  const url = `${process.env.BASE_URL}api/auth/${id}/${route}/${token.token}`;
                  
                  //send route to user email
                  sendEmail(email, action, url);
            }    

      } catch(error) {

            return res.status(400).json({error: error})
      }
};

////////////create JWT token//////////////
exports.jwtToken = async (id, email, admin) => {

      const token = await jwt.sign(
        {
          id: id, 
          email: email, 
          admin: admin
        },
        process.env.SECRETJWT,
        {expiresIn: '30d'}
        );

      return token;      
};