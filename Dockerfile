# Step 1: Build the app in image 'builder'
FROM node:12.8-alpine AS builder

WORKDIR /usr/src/app
COPY . .
RUN yarn install
RUN yarn global add angular-cli

# # Step 2: Use build output from 'builder'
# FROM nginx:1.17.1-alpine

# ## Remove default Nginx website
# RUN rm -rf /usr/share/nginx/html/*

# COPY /nginx.conf /etc/nginx/nginx.conf

# COPY --from=builder /app/dist/ /usr/share/nginx/html

# RUN echo "for mainFileName in /usr/share/nginx/html/main*.js ;\
#             do \
#               envsubst '\$BACKEND_API_URL ' < \$mainFileName > main.tmp ;\
#               mv main.tmp \${mainFileName} ;\
#             done \
#             && nginx -g 'daemon off;'" > run.sh

# ENTRYPOINT ["sh", "run.sh"]

EXPOSE 4200

CMD [ "yarn", "start" ]
