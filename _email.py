from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from email.header import Header
from email.mime.text import MIMEText
from email.utils import parseaddr, formataddr
import smtplib
import configparser
import os

config = configparser.ConfigParser()
config.read('config.ini')
from_addr = config['email']['from_addr']
password = config['email']['password']
to_addr = config['email']['to_addr']
smtp_server = config['email']['smtp_server']

def _format_addr(s):
    name, addr = parseaddr(s)
    return formataddr((Header(name, 'utf-8').encode(), addr))

def send_email(subject = "web page title", content = "web page content", attachments = []):
    msg = MIMEMultipart()
    msg['From'] = _format_addr('EmailThisPage <%s>' % 'EmailThisPage')
    msg['To'] = _format_addr('My Email <%s>' % to_addr)
    msg['Subject'] = Header(subject, 'utf-8').encode()
    msg.attach(MIMEText(content, 'html', 'utf-8'))
    for mime in attachments:
        msg.attach(mime)
    server = smtplib.SMTP(smtp_server, 25)
    server.set_debuglevel(0)
    server.login(from_addr, password)
    server.sendmail(from_addr, [to_addr], msg.as_string())
    server.quit()





