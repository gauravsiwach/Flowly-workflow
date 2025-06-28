import requests
import feedparser
import re
from typing import Dict, Any, List
import time
from datetime import datetime, timedelta
import email.utils

def fetch_top_news(state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Fetch top news headlines from RSS feeds (last 2 days only)
    """
    print("📰 fetch_top_news...")
    
    # Get category from input (optional) - handle empty/None values better
    category_input = state.get("node_result") or state.get("node_input") or ""
    if category_input and isinstance(category_input, str):
        category = category_input.lower().strip()
        if not category:  # Empty string after stripping
            category = "general"
    else:
        category = "general"
    
    print(f"Category: '{category}'")
    
    # Calculate date threshold (2 days ago)
    now = datetime.now()
    two_days_ago = now - timedelta(days=2)
    print(f"Filtering news from: {two_days_ago.strftime('%Y-%m-%d %H:%M:%S')} onwards")
    
    # Define RSS news sources
    news_sources = {
        "BBC News": {
            "url": "https://feeds.bbci.co.uk/news/rss.xml",
            "category_keywords": {
                "technology": ["tech", "technology", "digital", "ai", "artificial intelligence", "software", "app"],
                "business": ["business", "economy", "finance", "market", "company", "investment"],
                "science": ["science", "research", "study", "discovery", "scientist"],
                "world": ["world", "international", "global", "country", "nation"],
                "politics": ["politics", "government", "election", "policy", "minister", "president"]
            }
        },
        "CNN": {
            "url": "http://rss.cnn.com/rss/edition.rss",
            "category_keywords": {
                "technology": ["tech", "technology", "digital", "ai", "artificial intelligence", "software"],
                "business": ["business", "economy", "finance", "market", "company"],
                "science": ["science", "research", "study", "discovery"],
                "world": ["world", "international", "global", "country"],
                "politics": ["politics", "government", "election", "policy"]
            }
        },
        "Reuters": {
            "url": "http://feeds.reuters.com/reuters/topNews",
            "category_keywords": {
                "technology": ["tech", "technology", "digital", "ai", "artificial intelligence", "software"],
                "business": ["business", "economy", "finance", "market", "company"],
                "science": ["science", "research", "study", "discovery"],
                "world": ["world", "international", "global", "country"],
                "politics": ["politics", "government", "election", "policy"]
            }
        },
        "Al Jazeera": {
            "url": "https://www.aljazeera.com/xml/rss/all.xml",
            "category_keywords": {
                "technology": ["tech", "technology", "digital", "ai", "artificial intelligence"],
                "business": ["business", "economy", "finance", "market"],
                "science": ["science", "research", "study", "discovery"],
                "world": ["world", "international", "global"],
                "politics": ["politics", "government", "election", "policy"]
            }
        },
        "Hindustan Times": {
            "url": "https://www.hindustantimes.com/rss/topnews/rssfeed.xml",
            "category_keywords": {
                "technology": ["tech", "technology", "digital", "ai", "artificial intelligence", "software"],
                "business": ["business", "economy", "finance", "market", "company"],
                "science": ["science", "research", "study", "discovery"],
                "world": ["world", "international", "global", "country"],
                "politics": ["politics", "government", "election", "policy"]
            }
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
        for source_name, source_info in news_sources.items():
            print(f"Fetching from {source_name}...")
            
            try:
                # Parse RSS feed
                feed = feedparser.parse(source_info["url"])
                
                if feed.bozo:
                    print(f"  Warning: Feed parsing issues for {source_name}")
                
                print(f"  Found {len(feed.entries)} entries in RSS feed")
                
                # Extract and filter headlines
                filtered_headlines = []
                for entry in feed.entries[:20]:  # Get more entries for date filtering
                    try:
                        title = entry.get('title', '').strip()
                        description = entry.get('summary', '').strip()
                        link = entry.get('link', '')
                        published = entry.get('published', '')
                        
                        # Parse publication date
                        pub_date = parse_date(published)
                        
                        # Skip articles older than 2 days
                        if not is_recent_article(pub_date, two_days_ago):
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
                            
                            # Include all recent articles (no category filtering)
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
                    for entry in feed.entries[:15]:
                        try:
                            title = entry.get('title', '').strip()
                            description = entry.get('summary', '').strip()
                            link = entry.get('link', '')
                            published = entry.get('published', '')
                            
                            # Parse publication date
                            pub_date = parse_date(published)
                            
                            # Skip articles older than 2 days
                            if not is_recent_article(pub_date, two_days_ago):
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
        news_text = "Recent News Articles (Last 2 Days):\n\n"
        
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
            state["node_result"] = "No recent news articles found in the last 2 days. Please try again later."
        else:
            state["node_result"] = news_text
        
    except Exception as e:
        state["node_result"] = f"Error fetching news: {str(e)}"
    
    return state 