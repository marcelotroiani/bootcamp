from splinter import Browser
from bs4 import BeautifulSoup
import pandas as pd

# Initialize browser
def init_browser():
    # Open the chrome browser
    executable_path = {"executable_path": "chromedriver.exe"}
    return Browser("chrome", **executable_path, headless=False)

# Use the open browser to visit the url and BeautifulSoup to parse the html
def soup_url(browser, url):
    browser.visit(url)
    html = browser.html
    return BeautifulSoup(html, 'html.parser')

# Function to scrape for weather in Cost Rica
def scrape():

    # Initialize browser
    browser = init_browser()

    # Scrape NASA news page into soup
    soup = soup_url(browser, 'https://mars.nasa.gov/news/')

    # Extract the title and paragraph for the latest news (first in the list)
    news_title = soup.find('ul', class_='item_list').find('div', class_='content_title').get_text()
    news_paragraph = soup.find('ul', class_='item_list').find('div', class_='article_teaser_body').get_text()

    # Scrape JPL page into soup
    soup = soup_url(browser, 'https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars')

    # Find the folder of featured image
    div_style = soup.find('article')['style']
    image_folder = div_style.replace("background-image: url('", "").replace("');", "")

    # Add parent url to get the full address
    featured_image_url = 'https://www.jpl.nasa.gov' + image_folder

    # Scrape Mars Weather Twitter page into soup
    soup = soup_url(browser, 'https://twitter.com/marswxreport?lang=en')

    # Find list with all tweets
    container = soup.find('ol', class_='stream-items')
    tweets_list = container.find_all('p', class_='tweet-text')

    # Search for the last tweet with weather information
    for tweet in tweets_list:
        mars_weather = tweet.text.strip()
        if mars_weather.startswith("Sol"):
            break

    # Use Pandas to read the hmtl and convert data to a HTML table string
    url = 'https://space-facts.com/mars/'
    tables = pd.read_html(url)
    table = tables[0]
    table.columns = ["Description","Value"]
    table.set_index('Description', inplace=True)
    html_table = table.to_html().replace('\n', '')

    # Scrape USGS page into soup
    soup = soup_url(browser, 'https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars')

    # Get the list of hemispheres
    hem_list = soup.find_all('div', class_='item')

    # Initialize an empty list for names and urls
    hemisphere_image_urls = []

    # Loop through each hemisphere to collect the name and link to the image
    for hem in hem_list:
    
        # Get the title for the current hemisphere of the list
        title = hem.find('h3').text.strip()
    
        # Click the link with hemisphere title
        browser.find_by_text(title).first.click()
        html = browser.html
        soup = BeautifulSoup(html, 'html.parser')
    
        # Get the url for the image
        img_url = soup.find('div', class_='downloads').find('a')['href']
    
        # Return to the previous page
        browser.find_by_text('Back').first.click()
    
        # Append the list of outputs
        hemisphere_image_urls.append({
            "title": title.replace(' Enhanced',''),
            "img_url": img_url
        })

    # Store in dictionary
    mars_info = {
        "news_title": news_title,
        "news_paragraph": news_paragraph,
        "featured_image_url": featured_image_url,
        "mars_weather": mars_weather,
        "facts_table": html_table,
        "hemisphere_info": hemisphere_image_urls
    }

    # Return results
    return mars_info