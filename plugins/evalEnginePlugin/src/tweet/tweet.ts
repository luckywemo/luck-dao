// import type { TweetEditControl } from './edit.js'
export interface TweetEditControl {
  edit_tweet_ids: string[]
  editable_until_msecs: string
  is_edit_eligible: boolean
  edits_remaining: string
}
// import type { Indices, TweetEntities } from './entities.js'
export type Indices = [number, number]

export interface HashtagEntity {
  indices: Indices
  text: string
}

export interface UserMentionEntity {
  id_str: string
  indices: Indices
  name: string
  screen_name: string
}

export interface MediaEntity {
  display_url: string
  expanded_url: string
  indices: Indices
  url: string
}

export interface UrlEntity {
  display_url: string
  expanded_url: string
  indices: Indices
  url: string
}

export interface SymbolEntity {
  indices: Indices
  text: string
}

export interface TweetEntities {
  hashtags: HashtagEntity[]
  urls: UrlEntity[]
  user_mentions: UserMentionEntity[]
  symbols: SymbolEntity[]
  media?: MediaEntity[]
}
// import type { MediaDetails } from './media.js'

export type RGB = {
  red: number
  green: number
  blue: number
}

export type Rect = {
  x: number
  y: number
  w: number
  h: number
}

export type Size = {
  h: number
  w: number
  resize: string
}

export interface VideoInfo {
  aspect_ratio: [number, number]
  variants: {
    bitrate?: number
    content_type: 'video/mp4' | 'application/x-mpegURL'
    url: string
  }[]
}

interface MediaBase {
  display_url: string
  expanded_url: string
  ext_media_availability: {
    status: string
  }
  ext_media_color: {
    palette: {
      percentage: number
      rgb: RGB
    }[]
  }
  indices: Indices
  media_url_https: string
  original_info: {
    height: number
    width: number
    focus_rects: Rect[]
  }
  sizes: {
    large: Size
    medium: Size
    small: Size
    thumb: Size
  }
  url: string
}

export interface MediaPhoto extends MediaBase {
  type: 'photo'
  ext_alt_text?: string
}

export interface MediaAnimatedGif extends MediaBase {
  type: 'animated_gif'
  video_info: VideoInfo
}

export interface MediaVideo extends MediaBase {
  type: 'video'
  video_info: VideoInfo
}

export type MediaDetails = MediaPhoto | MediaAnimatedGif | MediaVideo

// import type { TweetPhoto } from './photo.js'
export interface TweetPhoto {
  backgroundColor: RGB
  cropCandidates: Rect[]
  expandedUrl: string
  url: string
  width: number
  height: number
}

// import type { TweetUser } from './user.js'
export interface TweetUser {
  id_str: string
  name: string
  profile_image_url_https: string
  profile_image_shape: 'Circle' | 'Square' | 'Hexagon'
  screen_name: string
  verified: boolean
  verified_type?: 'Business' | 'Government'
  is_blue_verified: boolean
}

// import type { TweetVideo } from './video.js'
export interface TweetVideo {
  aspectRatio: [number, number]
  contentType: string
  durationMs: number
  mediaAvailability: {
    status: string
  }
  poster: string
  variants: {
    type: string
    src: string
  }[]
  videoId: {
    type: string
    id: string
  }
  viewCount: number
}

/**
 * Base tweet information shared by a tweet, a parent tweet and a quoted tweet.
 */
export interface TweetBase {
  /**
   * Language code of the tweet. E.g "en", "es".
   */
  lang: string
  /**
   * Creation date of the tweet in the format ISO 8601.
   */
  created_at: string
  /**
   * Text range of the tweet text.
   */
  display_text_range: Indices
  /**
   * All the entities that are part of the tweet. Like hashtags, mentions, urls, etc.
   */
  entities: TweetEntities
  /**
   * The unique identifier of the tweet.
   */
  id_str: string
  /**
   * The tweet text, including the raw text from the entities.
   */
  text: string
  /**
   * Information about the user who posted the tweet.
   */
  user: TweetUser
  /**
   * Edit information about the tweet.
   */
  edit_control: TweetEditControl
  isEdited: boolean
  isStaleEdit: boolean
}

/**
 * A tweet as returned by the Twitter syndication API.
 */
export interface Tweet extends TweetBase {
  __typename: 'Tweet'
  favorite_count: number
  mediaDetails?: MediaDetails[]
  photos?: TweetPhoto[]
  video?: TweetVideo
  conversation_count: number
  news_action_type: 'conversation'
  quoted_tweet?: QuotedTweet
  in_reply_to_screen_name?: string
  in_reply_to_status_id_str?: string
  in_reply_to_user_id_str?: string
  parent?: TweetParent
  possibly_sensitive?: boolean
}

/**
 * The parent tweet of a tweet reply.
 */
export interface TweetParent extends TweetBase {
  reply_count: number
  retweet_count: number
  favorite_count: number
}

/**
 * A tweet quoted by another tweet.
 */
export interface QuotedTweet extends TweetBase {
  reply_count: number
  retweet_count: number
  favorite_count: number
  mediaDetails?: MediaDetails[]
  self_thread: {
    id_str: string
  }
}