@echo off
set NODE_ENV=production
set pay-check-server_jwtPrivateKey=cb793e96-f903-4724-a754-ea0ffbfd42d4
set pay-check-server_cryptopass=cb793e96f9034724a754ea0ffbfd42d4
set mongoConnectionString=mongodb+srv://newbuz:mangomouse930@cluster0-8zbtw.gcp.mongodb.net/pay-check?retryWrites=true&w=majority
set azureStorageConnectionString=DefaultEndpointsProtocol=https;AccountName=paycheckdiag;AccountKey=kKgjINJnV/Sl6lRCaH2s7aQcIULN/3yZd7AL4MELq/Sn4mXX87oi1hw+4Cc03TPL9VIhxGzZO1djC1EQphQfGg==;EndpointSuffix=core.windows.net
@echo ===== Results: =====
set NODE_ENV
set pay-check-server_jwtPrivateKey
set pay-check-server_cryptopass
set mongoConnectionString
set azureStorageConnectionString