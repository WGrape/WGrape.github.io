FROM ruby:3.1-slim

WORKDIR /srv/jekyll

# Install dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy Gemfile and Gemfile.lock first for better caching
COPY Gemfile* ./

# Install dependencies
RUN bundle install

# Copy the rest of the application
COPY . .

EXPOSE 4000

CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--incremental", "--livereload"]
