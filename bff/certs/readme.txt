#generate proper keys and put them to the action's secrets :
CERT_PFX_B64 and CERT_PEM_B64 (see deploy-dev.yml ln 42)


# this will copy cert.pem content to clipboard
$b64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes('bff\certs\cert.pem'))
Set-Clipboard $b64

#and this is for key.pem
$b64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes('bff\certs\key.pem'))
Set-Clipboard $b64

#just in case, command to create self-signed CERTIFICATE
openssl req -x509 -newkey rsa:2048 -nodes -keyout key.pem -out cert.pem -days 365 -subj "/CN=localhost"