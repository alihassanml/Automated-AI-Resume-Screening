import os
from fastapi import HTTPException
import smtplib
from email.message import EmailMessage

def send_job_offer_email(user_email, user_name, position):
    offer_code  = '112134145'
    email_address = 'noreply.kontactly@gmail.com'
    email_password = 'okauihsgyuywftcn'

    msg = EmailMessage()
    msg['From'] = email_address
    msg['To'] = user_email
    msg['Subject'] = f"🎉 You're Hired! Offer Letter for {position} at Kontactly"

    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Job Offer - Kontactly</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                background-color: #f9f9f9;
                padding: 30px;
            }}
            .container {{
                max-width: 640px;
                margin: auto;
                background: #ffffff;
                border-radius: 10px;
                padding: 25px;
                box-shadow: 0 0 15px rgba(0,0,0,0.1);
            }}
            .header img {{
                max-width: 100%;
                height: auto;
                border-radius: 8px;
            }}
            h2 {{
                color: #2c5268;
                margin-top: 20px;
                text-align: center;
            }}
            p {{
                color: #333;
                font-size: 16px;
                line-height: 1.5;
            }}
            .offer-code {{
                background: #2c5268;
                color: white;
                padding: 15px;
                font-size: 24px;
                text-align: center;
                border-radius: 8px;
                margin: 20px 0;
                letter-spacing: 1px;
            }}
            .signature {{
                margin-top: 30px;
                font-size: 14px;
                color: #555;
            }}
            a {{
                color: #2c5268;
                text-decoration: none;
            }}
            .social-icons img {{
                width: 22px;
                margin-right: 10px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://datahorsedata.s3.us-east-1.amazonaws.com/Kontantly+email+image.png" alt="Kontactly">
            </div>
            <h2>Congratulations, {user_name}!</h2>
            <p>We are thrilled to offer you the position of <strong>{position}</strong> at <strong>Kontactly</strong>. After reviewing your qualifications and speaking with you, we're confident that you'll be a fantastic addition to our team.</p>
            <p>To accept this offer and access your official offer letter, please use the code below:</p>
            <div class="offer-code">{offer_code}</div>
            <p>If you have any questions, feel free to reply to this email or reach out to our support team.</p>
            <div class="signature">
                Cheers,<br>
                <strong>The Kontactly Team</strong><br>
                Phone: <a href="tel:+32474171274">+32 474 17 12 74</a><br>
                Email: <a href="mailto:support@kontactly.ai">support@kontactly.ai</a>
            </div>
            <div class="social-icons">
                <a href="https://kontactly.ai/" target="_blank">
                    <img src="https://datahorsedata.s3.us-east-1.amazonaws.com/kontantly_icon.png" alt="Website">
                </a>
                <a href="https://www.linkedin.com/showcase/kontactly-ai" target="_blank">
                    <img src="https://datahorsedata.s3.us-east-1.amazonaws.com/Linkedin_icon+(1).png" alt="LinkedIn">
                </a>
                <a href="https://github.com/DeDolphins/Kontactly" target="_blank">
                    <img src="https://datahorsedata.s3.us-east-1.amazonaws.com/Github_icon.png" alt="GitHub">
                </a>
            </div>
        </div>
    </body>
    </html>
    """

    msg.add_alternative(html_content, subtype='html')

    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
        smtp.login(email_address, email_password)
        smtp.send_message(msg)

    return {'Message': 'Job offer email sent successfully'}
