#coding=utf-8
from http.server import BaseHTTPRequestHandler, HTTPServer
from email.mime.application import MIMEApplication
from _email import send_email
import cgi

def get_attchment_mime(attachment):
    if not isinstance(attachment, list):
        mime = MIMEApplication(attachment.file.read())
        mime.add_header('Content-Disposition', attachment.name,
                        filename=('gbk', '', attachment.filename))
        return [mime]
    else:
        return [get_attchment_mime(item) for item in attachment]

class post_handler(BaseHTTPRequestHandler):
    def do_POST(self):
        form = cgi.FieldStorage(
            fp=self.rfile,
            headers=self.headers,
            environ={
                'REQUEST_METHOD':'POST',
                'CONTENT_TYPE':self.headers['Content-Type'],
            }
        )
        title = form['title'].value
        content = form['content'].value
        try:
            attachments = get_attchment_mime(form['attachments'])
        except:
            attachments = []
        try:
            send_email(title, content, attachments)
            self.send_response(200)
        except:
            self.send_response(500)
        self.end_headers()
        return
        


def start_server():
    sever = HTTPServer(("", 2333), post_handler)
    sever.serve_forever()


if __name__ == '__main__':
    start_server()
