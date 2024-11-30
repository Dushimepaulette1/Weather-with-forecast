# Weather Application 🌤️

This project is a weather app that displays current weather and a 5-day forecast using the [SheCodes Weather API](https://www.shecodes.io/learn/apis/weather). The app is deployed to web-01 and web-02 servers with Nginx, configured for load balancing.

---

## Features

- Real-time weather updates.
- 5-day forecast with daily max/min temperatures.

---

## Running Locally

### Prerequisites

1. Install [Git](https://git-scm.com/).
2. Clone this repository:
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```
3. Add a `config.json` file with API keys:
   ```json
   {
     "WEATHER_API_KEY": "<your_weather_api_key>",
     "FORECAST_API_KEY": "<your_forecast_api_key>"
   }
   ```
4. Open `index.html` in your browser or use a live server.

---

## Deployment Instructions

### Deploying to Servers

1. **Copy Files to Servers**:

   - Upload app files to `/var/www/html` on **web-01** and **web-02**:
     ```bash
     scp -r * user@web-01:/var/www/html/
     scp -r * user@web-02:/var/www/html/
     ```

2. **Set Up Nginx**:

   - Configure Nginx on each server to serve the app:

     ```nginx
     server {
         listen 80;
         server_name localhost;
         root /var/www/html;
         index index.html;

         location / {
             try_files $uri $uri/ =404;
         }
     }
     ```

   - Restart Nginx:
     ```bash
     sudo systemctl restart nginx
     ```

---

### Configuring Load Balancer with Nginx

1. **Install Nginx** on the load balancer server:

   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. **Edit Nginx Configuration**:

   - Update `/etc/nginx/sites-available/default` with:

     ```nginx
     upstream backend_servers {
         server web-01;
         server web-02;
     }

     server {
         listen 80;
         server_name load-balancer;

         location / {
             proxy_pass http://backend_servers;
             proxy_set_header Host $host;
             proxy_set_header X-Real-IP $remote_addr;
         }
     }
     ```

3. **Restart Nginx**:

   ```bash
   sudo systemctl restart nginx
   ```

4. **Test Load Balancer**:
   - Access the load balancer's IP to confirm traffic alternates between web-01 and web-02.

---

## Challenges and Solutions

### 1. **Nginx Configuration Errors**

- _Problem_: Nginx wouldn’t serve the app files correctly.
- _Solution_: Verified file permissions and corrected root path in the configuration.

### 2. **API Keys Not Loading**

- _Problem_: Missing or improperly structured `config.json`.
- _Solution_: Double-checked file path and ensured proper JSON structure.

---

## API Information

- **SheCodes Weather API**: [Documentation](https://www.shecodes.io/learn/apis/weather)

---

## Credits

- [SheCodes Weather API](https://www.shecodes.io/learn/apis/weather)
- Load balancing: [Nginx](https://nginx.org/)
- Servers: **web-01**, **web-02**

---

## License

Open-source and free to use. 😊

---
