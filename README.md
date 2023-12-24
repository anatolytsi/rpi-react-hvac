# Raspberry Pi (RPi) React Heating, Ventilation, Air Conditioning (HVAC)

A simple RPi HVAC control frontend with React for a cafe

Steps:

1. `docker stop react-hvac`
2. `docker rm react-hvac`
3. `sudo docker build --tag react-hvac-container -f Dockerfile . --no-cache`
4. `sudo docker run -p 3000:3000 -d --restart=always --network=nginx_proxy --name react-hvac react-hvac-container`
