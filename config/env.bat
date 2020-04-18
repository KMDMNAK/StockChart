set PROJECT_ID=stockchart
set GCLOUD_PROJECT=%PROJECT_ID%
echo "You should execute this script from root directory."
set QUANDL_CONFIG_PATH=%CD%\environment\quandl.config.json
set GOOGLE_APPLICATION_CREDENTIALS=%CD%\environment\%PROJECT_ID%-sa.json