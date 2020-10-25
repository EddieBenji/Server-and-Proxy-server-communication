#! /bin/bash
#
# Copyright 2020 by TIBCO Software Inc.
# All rights reserved.
#
# This software is confidential and proprietary information of
# TIBCO Software Inc.
#
#


#randomPass=''
# Change this to nodejs-dummy-server/generated #for the server !!
# Or nodejs-dummy-server/proxy_generated #for the proxy server !!
CERTIFICATE_PATH=/secondary-disk/Code/dummyServer/nodejs-dummy-server/redtail-build/withoutpassword/
CA_KEY=${CERTIFICATE_PATH}ca.key
CA_CERT=${CERTIFICATE_PATH}cacert
SERVER_KEY=${CERTIFICATE_PATH}key
SERVER_CSR=${CERTIFICATE_PATH}server.csr
SERVER_CERT=${CERTIFICATE_PATH}certificate
CA_CERT_SUBJECT="/C=US/ST=California/L=Palo Alto/O=TIBCO/OU=TIBCO OI/CN=TIBCO Hawk RedTail CA"
SERVER_CERT_SUBJECT="/C=US/ST=California/L=Palo Alto/O=TIBCO/OU=TIBCO OI/CN=TIBCO Hawk RedTail"

QUERYNODE_CLIENT_KEY=${CERTIFICATE_PATH}querynode-client-key
QUERYNODE_CLIENT_CSR=${CERTIFICATE_PATH}querynode-client.csr
QUERYNODE_CLIENT_CERT=${CERTIFICATE_PATH}querynode-client-certificate
QUERYNODE_CLIENT_CERT_SUBJECT="/C=US/ST=California/L=Palo Alto/O=TIBCO/OU=TIBCO OI/CN=querynode"

PROMETHEUS_CLIENT_KEY=${CERTIFICATE_PATH}prometheus-client-key
PROMETHEUS_CLIENT_CSR=${CERTIFICATE_PATH}prometheus-client.csr
PROMETHEUS_CLIENT_CERT=${CERTIFICATE_PATH}prometheus-client-certificate
PROMETHEUS_CLIENT_CERT_SUBJECT="/C=US/ST=California/L=Palo Alto/O=TIBCO/OU=TIBCO OI/CN=prometheus"

MYSQL_CLIENT_KEY=${CERTIFICATE_PATH}mysql-client-key
MYSQL_CLIENT_CSR=${CERTIFICATE_PATH}mysql-client.csr
MYSQL_CLIENT_CERT=${CERTIFICATE_PATH}mysql-client-certificate

WEBAPP_CLIENT_KEY=${CERTIFICATE_PATH}webapp-client-key
WEBAPP_CLIENT_CSR=${CERTIFICATE_PATH}webapp-client.csr
WEBAPP_CLIENT_CERT=${CERTIFICATE_PATH}webapp-client-certificate

GRAFANA_KEY=${CERTIFICATE_PATH}grafana-key
GRAFANA_CSR=${CERTIFICATE_PATH}grafana.csr
GRAFANA_CERT=${CERTIFICATE_PATH}grafana-certificate



#cleanup
#rm -f $CA_KEY &&
#rm -f $CA_CERT &&
#
##rm -f $CA_INVALID_KEY &&
##rm -f $CA_INVALID_CERT &&
#
#rm -f $SERVER_CERT &&
#rm -f $SERVER_KEY &&
#rm -f $SERVER_CSR &&
#rm -f $SERVER_KEYSTORE &&
#rm -f $SERVER_TRUSTSTORE &&
#rm -f $SERVER_INVALID_TRUSTSTORE &&
#
#rm -f $CLIENT_KEY &&
#rm -f $CLIENT_CERT &&
#rm -f $CLIENT_CSR &&
#rm -f $CLIENT_KEYSTORE &&
#rm -f $CLIENT_TRUSTSTORE &&

#rm -f $CLIENT_INVALID_KEY &&
#rm -f $CLIENT_INVALID_CERT &&
#rm -f $CLIENT_INVALID_CSR &&
#rm -f $CLIENT_INVALID_KEYSTORE &&

validity=183
echo "LISTING ALL FILES: "
ls -ltr


#creating CA
openssl genrsa  -out $CA_KEY  2048 &&
echo "CA key created"   &&

openssl req -new -x509 -days $validity -key $CA_KEY  -out $CA_CERT -subj "$CA_CERT_SUBJECT" &&
echo "CA cert created"  &&

#creating Component keys and certs
openssl genrsa  -out $SERVER_KEY  2048  &&
echo "Server key created"
openssl req -new -key $SERVER_KEY  -out $SERVER_CSR -subj "$SERVER_CERT_SUBJECT" &&
echo "Server certificate signing request created"  &&
openssl x509 -req -days $validity -in $SERVER_CSR -CA $CA_CERT  -CAkey $CA_KEY -set_serial 02 -out $SERVER_CERT &&
echo "Server certificate created"  &&

# Create a non-passphrase protected key for mysql server from already generated above server key
openssl rsa -in $SERVER_KEY -out ${CERTIFICATE_PATH}mysql-key &&
echo "Mysql Server key created"

#creating QueryNode client keys and certs
openssl genrsa  -out $QUERYNODE_CLIENT_KEY 2048 &&
echo "QueryNode client key created"  &&
openssl req -new -key $QUERYNODE_CLIENT_KEY -out $QUERYNODE_CLIENT_CSR -subj "$QUERYNODE_CLIENT_CERT_SUBJECT" &&
echo "QueryNode client certificate signing request created"  &&
openssl x509 -req -days $validity -in $QUERYNODE_CLIENT_CSR -CA $CA_CERT -CAkey $CA_KEY -set_serial 02 -out $QUERYNODE_CLIENT_CERT &&
echo "QueryNode client certificate created"  &&

#creating Prometheus Client keys and certs without password
openssl genrsa -out $PROMETHEUS_CLIENT_KEY 2048 &&
echo "Prometheus Client key created"  &&
openssl req -new -key $PROMETHEUS_CLIENT_KEY -out $PROMETHEUS_CLIENT_CSR -subj "$PROMETHEUS_CLIENT_CERT_SUBJECT" &&
echo "Prometheus Client certificate signing request created"  &&
openssl x509 -req -days $validity -in $PROMETHEUS_CLIENT_CSR -CA $CA_CERT -CAkey $CA_KEY -set_serial 02 -out $PROMETHEUS_CLIENT_CERT &&
echo "Prometheus Client certificate created"  &&

#creating MySql Client keys and certs
openssl genrsa  -out $MYSQL_CLIENT_KEY 2048  &&
echo "MySql Client key created"
openssl req -new -key $MYSQL_CLIENT_KEY -out $MYSQL_CLIENT_CSR -subj "$SERVER_CERT_SUBJECT" &&
echo "MySql Client certificate signing request created"  &&
openssl x509 -req -days $validity -in $MYSQL_CLIENT_CSR -CA $CA_CERT -CAkey $CA_KEY -set_serial 02 -out $MYSQL_CLIENT_CERT &&
echo "MySql Client certificate created"  &&

#creating Webapp Client keys and certs
openssl genrsa  -out $WEBAPP_CLIENT_KEY 2048  &&
echo "WebApp Client key created"
openssl req -new -key $WEBAPP_CLIENT_KEY -out $WEBAPP_CLIENT_CSR -subj "$SERVER_CERT_SUBJECT" &&
echo "WebApp Client certificate signing request created"  &&
openssl x509 -req -days $validity -in $WEBAPP_CLIENT_CSR -CA $CA_CERT -CAkey $CA_KEY -set_serial 02 -out $WEBAPP_CLIENT_CERT &&
echo "WebApp Client certificate created"  &&

#creating Grafana keys and certs
openssl genrsa -out $GRAFANA_KEY 2048  &&
echo "Grafana key created"
openssl req -new -key $GRAFANA_KEY -out $GRAFANA_CSR -subj "$SERVER_CERT_SUBJECT" &&
echo "Grafana certificate signing request created"  &&
openssl x509 -req -days $validity -in $GRAFANA_CSR -CA $CA_CERT -CAkey $CA_KEY -set_serial 02 -out $GRAFANA_CERT &&
echo "Grafana certificate created"

chmod -R 777 ${CERTIFICATE_PATH}*

echo "Cert files created without password"
