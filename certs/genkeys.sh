#! /bin/bash
#
# Copyright 2020 by TIBCO Software Inc.
# All rights reserved.
#
# This software is confidential and proprietary information of
# TIBCO Software Inc.
#
#


randomPass='capass'
CERTIFICATE_PATH=/home/jpalomo/Desktop/mutual/Server-and-Proxy-server-communication/certs/

CA_KEY=${CERTIFICATE_PATH}ca.key
CA_CERT=${CERTIFICATE_PATH}cacert
CA_CERT_SUBJECT="/C=US/ST=California/L=Palo Alto/O=TIBCO/OU=TIBCO OI/CN=ca.localhost"

CA_INVALID_KEY=${CERTIFICATE_PATH}ca-invalid.key
CA_INVALID_CERT=${CERTIFICATE_PATH}ca-invalid-cert
CA_INVALID_CERT_SUBJECT="/C=US/ST=California/L=Palo Alto/O=TIBCO/OU=TIBCO OI/CN=Invalid CA"

SERVER_KEY=${CERTIFICATE_PATH}server-key
SERVER_CSR=${CERTIFICATE_PATH}server.csr
SERVER_CERT=${CERTIFICATE_PATH}server-certificate
SERVER_CERT_SUBJECT="/C=US/ST=California/L=Palo Alto/O=TIBCO/OU=TIBCO OI/CN=server.localhost"
SERVER_KEYSTORE=${CERTIFICATE_PATH}server-keystore.p12
SERVER_TRUSTSTORE=${CERTIFICATE_PATH}server-truststore.p12
SERVER_INVALID_TRUSTSTORE=${CERTIFICATE_PATH}server-invalid-truststore.p12

CLIENT_KEY=${CERTIFICATE_PATH}client-key
CLIENT_CERT=${CERTIFICATE_PATH}client-certificate
CLIENT_CSR=${CERTIFICATE_PATH}client.csr
CLIENT_CERT_SUBJECT="/C=US/ST=California/L=Palo Alto/O=TIBCO/OU=TIBCO OI/CN=client.localhost"
CLIENT_KEYSTORE=${CERTIFICATE_PATH}client-keystore.p12
CLIENT_TRUSTSTORE=${CERTIFICATE_PATH}client-truststore.p12

DQN_KEY=${CERTIFICATE_PATH}querynode-key
DQN_CERT=${CERTIFICATE_PATH}querynode-certificate
DQN_CSR=${CERTIFICATE_PATH}querynode.csr
DQN_CERT_SUBJECT="/C=US/ST=California/L=Palo Alto/O=TIBCO/OU=TIBCO OI/CN=readtailquerynode"
DQN_KEYSTORE=${CERTIFICATE_PATH}querynode-keystore.p12
DQN_TRUSTSTORE=${CERTIFICATE_PATH}querynode-truststore.p12

PROM_KEY=${CERTIFICATE_PATH}prom-key
PROM_CERT=${CERTIFICATE_PATH}prom-certificate
PROM_CSR=${CERTIFICATE_PATH}prom.csr
PROM_CERT_SUBJECT="/C=US/ST=California/L=Palo Alto/O=TIBCO/OU=TIBCO OI/CN=redtailprometheius"
PROM_KEYSTORE=${CERTIFICATE_PATH}prom-keystore.p12
PROM_TRUSTSTORE=${CERTIFICATE_PATH}prom-truststore.p12


GRAFANA_CAKEY=${CERTIFICATE_PATH}grafana-ca.key
GRAFANA_CACERT=${CERTIFICATE_PATH}grafana-cacert
GRAFANA_CACERT_SUBJECT="/C=US/ST=California/L=Palo Alto/O=TIBCO/OU=TIBCO OI/CN=Grafana CA"
GRAFANA_KEY=${CERTIFICATE_PATH}grafana-key
GRAFANA_CERT=${CERTIFICATE_PATH}grafana-certificate
GRAFANA_CSR=${CERTIFICATE_PATH}grafana.csr
GRAFANA_CERT_SUBJECT="/C=US/ST=California/L=Palo Alto/O=TIBCO/OU=TIBCO OI/CN=grafana"

CLIENT_INVALID_KEY=${CERTIFICATE_PATH}client-invalid-key
CLIENT_INVALID_CERT=${CERTIFICATE_PATH}client-invalid-certificate
CLIENT_INVALID_CSR=${CERTIFICATE_PATH}client-invalid.csr
CLIENT_INVALID_CERT_SUBJECT="/C=US/ST=California/L=Palo Alto/O=TIBCO/OU=TIBCO OI/CN=Invalid Client"
CLIENT_INVALID_KEYSTORE=${CERTIFICATE_PATH}client-invalid-keystore.p12



#cleanup
rm -f $CA_KEY &&
rm -f $CA_CERT &&
rm -f $GRAFANA_CAKEY &&
rm -f $GRAFANA_CACERT &&

rm -f $CA_INVALID_KEY &&
rm -f $CA_INVALID_CERT &&

rm -f $SERVER_CERT &&
rm -f $SERVER_KEY &&
rm -f $SERVER_CSR &&
rm -f $SERVER_KEYSTORE &&
rm -f $SERVER_TRUSTSTORE &&
rm -f $SERVER_INVALID_TRUSTSTORE &&

rm -f $CLIENT_KEY &&
rm -f $CLIENT_CERT &&
rm -f $CLIENT_CSR &&
rm -f $CLIENT_KEYSTORE &&
rm -f $CLIENT_TRUSTSTORE &&

rm -f $DQN_KEY &&
rm -f $DQN_CERT &&
rm -f $DQN_CSR &&
rm -f $DQN_KEYSTORE &&
rm -f $DQN_TRUSTSTORE &&

rm -f $PROM_KEY &&
rm -f $PROM_CERT &&
rm -f $PROM_CSR &&
rm -f $PROM_KEYSTORE &&
rm -f $PROM_TRUSTSTORE &&

rm -f $GRAFANA_KEY &&
rm -f $GRAFANA_CERT &&
rm -f $GRAFANA_CSR &&

rm -f $CLIENT_INVALID_KEY &&
rm -f $CLIENT_INVALID_CERT &&
rm -f $CLIENT_INVALID_CSR &&
rm -f $CLIENT_INVALID_KEYSTORE &&


echo "LISTING ALL FILES: "
ls -ltr 



#creating CA
openssl genrsa -aes256 -out $CA_KEY -passout pass:$randomPass 2048 &&
echo "CA key created" &&

openssl req -new -x509 -days 183 -key $CA_KEY -passin pass:$randomPass -out $CA_CERT -subj "$CA_CERT_SUBJECT" &&
echo "CA cert created" &&

#creating Component keys and certs
openssl genrsa -aes256 -out $SERVER_KEY -passout pass:$randomPass 2048 &&
echo "Server key created" &&
openssl req -new -key $SERVER_KEY -passin pass:$randomPass -out $SERVER_CSR -subj "$SERVER_CERT_SUBJECT" &&
echo "Server certificate signing request created" &&
openssl x509 -req -days 183 -in $SERVER_CSR -CA $CA_CERT -passin pass:$randomPass -CAkey $CA_KEY -set_serial 02 -out $SERVER_CERT &&
echo "Server certificate created" &&
openssl pkcs12 -export -out $SERVER_KEYSTORE -inkey $SERVER_KEY -in $SERVER_CERT -chain -CAfile $CA_CERT
echo "Server keystore created"
keytool -importcert -storetype PKCS12 -keystore $SERVER_TRUSTSTORE -storepass changeit -alias ca -file $CA_CERT -noprompt
echo "server truststore created"
keytool -importcert -storetype PKCS12 -keystore $SERVER_INVALID_TRUSTSTORE -storepass changeit -alias ca -file $CA_INVALID_CERT -noprompt
echo "server invalid truststore created"

openssl genrsa -aes256 -out $CLIENT_KEY -passout pass:$randomPass 2048 &&
echo "Client key created" &&
openssl req -new -key $CLIENT_KEY -passin pass:$randomPass -out $CLIENT_CSR -subj "$CLIENT_CERT_SUBJECT" &&
echo "Client certificate signing request created" &&
openssl x509 -req -days 183 -in $CLIENT_CSR -CA $CA_CERT -passin pass:$randomPass -CAkey $CA_KEY -set_serial 02 -out $CLIENT_CERT &&
echo "Client certificate created" &&
openssl pkcs12 -export -out $CLIENT_KEYSTORE -inkey $CLIENT_KEY -in $CLIENT_CERT -chain -CAfile $CA_CERT
echo "Client keystore created"
keytool -importcert -storetype PKCS12 -keystore $CLIENT_TRUSTSTORE -storepass changeit -alias ca -file $CA_CERT -noprompt
echo "Client truststore created"


chmod -R 777 ${CERTIFICATE_PATH}*

echo "Key password: "$randomPass
