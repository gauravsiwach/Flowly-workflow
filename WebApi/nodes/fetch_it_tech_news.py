import requests
import feedparser
import re
from typing import Dict, Any, List
import time
from datetime import datetime, timedelta
import email.utils

def fetch_it_tech_news(state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Fetch IT and tech news from RSS feeds (last 7 days only)
    """
    print("💻 fetch_it_tech_news...")
    
    # Calculate date threshold (7 days ago)
    now = datetime.now()
    seven_days_ago = now - timedelta(days=7)
    print(f"Filtering tech news from: {seven_days_ago.strftime('%Y-%m-%d %H:%M:%S')} onwards")
    
    # Define tech RSS news sources
    tech_sources = {
        "TechCrunch": {
            "url": "https://techcrunch.com/feed/",
        },
        "The Verge": {
            "url": "https://www.theverge.com/rss/index.xml",
        },
        "Ars Technica": {
            "url": "https://feeds.arstechnica.com/arstechnica/index",
        },
        "Reddit Technology": {
            "url": "https://www.reddit.com/r/technology/.rss",
        },
        "Reddit Programming": {
            "url": "https://www.reddit.com/r/programming/.rss",
        }
    }
    
    all_news = {}
    
    def parse_date(date_string):
        """Parse various date formats from RSS feeds"""
        if not date_string:
            return None
        
        try:
            # Try parsing RFC 2822 format (most common in RSS)
            parsed_date = email.utils.parsedate_to_datetime(date_string)
            return parsed_date
        except:
            try:
                # Try parsing ISO format
                parsed_date = datetime.fromisoformat(date_string.replace('Z', '+00:00'))
                return parsed_date
            except:
                try:
                    # Try parsing common formats
                    for fmt in ['%Y-%m-%d %H:%M:%S', '%Y-%m-%dT%H:%M:%S', '%Y-%m-%d']:
                        try:
                            parsed_date = datetime.strptime(date_string, fmt)
                            # Make timezone-aware by assuming UTC
                            from datetime import timezone
                            return parsed_date.replace(tzinfo=timezone.utc)
                        except:
                            continue
                except:
                    pass
        
        return None
    
    def is_recent_article(pub_date, threshold_date):
        """Check if article is recent, handling timezone issues"""
        if not pub_date:
            return True  # If no date, include it
        
        # Make threshold timezone-aware if it isn't already
        if threshold_date.tzinfo is None:
            from datetime import timezone
            threshold_date = threshold_date.replace(tzinfo=timezone.utc)
        
        # Make pub_date timezone-aware if it isn't already
        if pub_date.tzinfo is None:
            from datetime import timezone
            pub_date = pub_date.replace(tzinfo=timezone.utc)
        
        return pub_date >= threshold_date
    
    try:
        for source_name, source_info in tech_sources.items():
            print(f"Fetching from {source_name}...")
            
            try:
                # Parse RSS feed
                feed = feedparser.parse(source_info["url"])
                
                if feed.bozo:
                    print(f"  Warning: Feed parsing issues for {source_name}")
                
                print(f"  Found {len(feed.entries)} entries in RSS feed")
                
                # Extract and filter headlines
                filtered_headlines = []
                for entry in feed.entries[:25]:  # Get more entries for date filtering
                    try:
                        title = entry.get('title', '').strip()
                        description = entry.get('summary', '').strip()
                        link = entry.get('link', '')
                        published = entry.get('published', '')
                        
                        # Parse publication date
                        pub_date = parse_date(published)
                        
                        # Skip articles older than 7 days
                        if not is_recent_article(pub_date, seven_days_ago):
                            print(f"  Skipping old article: {title[:50]}... (published: {pub_date})")
                            continue
                        
                        if title and len(title) > 10 and len(title) < 200:  # Basic validation
                            # Clean the text
                            clean_title = re.sub(r'\s+', ' ', title).strip()
                            clean_description = re.sub(r'\s+', ' ', description).strip() if description else ""
                            
                            # Create full article content
                            article_content = clean_title
                            if clean_description:
                                article_content += "\n\n" + clean_description
                            
                            # Include all recent tech articles
                            filtered_headlines.append({
                                "title": clean_title,
                                "description": clean_description,
                                "content": article_content,
                                "link": link,
                                "published": published,
                                "pub_date": pub_date
                            })
                    
                    except Exception as e:
                        print(f"  Error processing entry: {str(e)}")
                        continue
                
                # Take top 3 headlines (or all if less than 3)
                if filtered_headlines:
                    all_news[source_name] = filtered_headlines[:3]
                else:
                    # If no filtered headlines, take first 3 recent headlines
                    recent_headlines = []
                    for entry in feed.entries[:20]:
                        try:
                            title = entry.get('title', '').strip()
                            description = entry.get('summary', '').strip()
                            link = entry.get('link', '')
                            published = entry.get('published', '')
                            
                            # Parse publication date
                            pub_date = parse_date(published)
                            
                            # Skip articles older than 7 days
                            if not is_recent_article(pub_date, seven_days_ago):
                                continue
                            
                            if title and len(title) > 10 and len(title) < 200:
                                clean_title = re.sub(r'\s+', ' ', title).strip()
                                clean_description = re.sub(r'\s+', ' ', description).strip() if description else ""
                                
                                article_content = clean_title
                                if clean_description:
                                    article_content += "\n\n" + clean_description
                                
                                recent_headlines.append({
                                    "title": clean_title,
                                    "description": clean_description,
                                    "content": article_content,
                                    "link": link,
                                    "published": published,
                                    "pub_date": pub_date
                                })
                        except:
                            continue
                    
                    all_news[source_name] = recent_headlines[:3]
                
                # Be respectful with requests
                time.sleep(1)
                
            except Exception as e:
                print(f"Error fetching from {source_name}: {str(e)}")
                all_news[source_name] = [f"Error fetching from {source_name}: {str(e)}"]
        
        # Format the output
        news_text = "Recent Tech News (Last 7 Days):\n\n"
        
        headline_count = 1
        for source_name, headlines in all_news.items():
            if headlines:
                news_text += f"{source_name}:\n"
                for headline in headlines:
                    news_text += f"{headline_count}. {headline['title']}\n"
                    if headline['description']:
                        news_text += f"   {headline['description']}\n"
                    if headline['published']:
                        news_text += f"   Published: {headline['published']}\n"
                    news_text += "\n"
                    headline_count += 1
                news_text += "\n"
        
        if headline_count == 1:
            state["node_result"] = "No recent tech news articles found in the last 7 days. Please try again later."
        else:
            state["node_result"] = news_text
        
    except Exception as e:
        state["node_result"] = f"Error fetching tech news: {str(e)}"
    
    return state 