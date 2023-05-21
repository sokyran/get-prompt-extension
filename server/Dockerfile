FROM bitnami/pytorch

# Copy local code to the container image.
ENV APP_HOME /app
ENV TRANSFORMERS_CACHE /app/cache
WORKDIR $APP_HOME
COPY . ./

RUN pip install --no-cache-dir -r requirements.txt

CMD ["python", "server.py"]
