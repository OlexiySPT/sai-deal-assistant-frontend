# this will copy cert.pem content to clipboard
$b64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes('bff\certs\cert.pem'))
Set-Clipboard $b64

#and this is for key.pem
$b64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes('bff\certs\key.pem'))
Set-Clipboard $b64

#just in case, command to create self-signed CERTIFICATE
openssl req -x509 -newkey rsa:2048 -nodes -keyout key.pem -out cert.pem -days 365 -subj "/CN=localhost"