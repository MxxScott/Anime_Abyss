<script href="./assets/scripts/script.js" setup></script>
<template>
    <title>Anime Abyss</title>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&family=Noto+Serif+JP:wght@200;400;700&display=swap" rel="stylesheet">
    link
    <div class="main">

    <div class="cursor" id="cursor"></div>
    <div class="cursor-ring" id="cursor-ring"></div>
    <canvas id="starfield"></canvas>

    <header>
          <nav>
            <a href="#" class="logo">Anime Abyss<span>アニメ・アビス</span></a>
            <ul>
              <li><a href="#trending">Trending</a></li>
              <li><a href="#featured">Featured</a></li>
              <li><a href="#genres">Genres</a></li>
              <li><a href="#seasonal">Seasonal</a></li>
              <li><a href="#" class="nav-cta">Watch Now</a></li>
            </ul>
          </nav>
    </header>

    <section class="hero">
      <div class="hero-orb"></div>
      <p class="hero-eyebrow">深淵のアニメ — Dive Into The Depths</p>
      <h1><span class="l1">Anime</span><span class="l2">Abyss</span></h1>
      <p class="hero-sub">Descend into an infinite universe of stories. Discover legendary classics and cutting-edge titles that reshape the boundaries of animation.</p>
      <div class="hero-actions">
        <a href="#trending" class="btn-primary">Explore Library</a>
        <a href="#seasonal" class="btn-outline">Seasonal Picks</a>
      </div>
      <div class="hero-stats">
        <div><div class="stat-num">12K+</div><div class="stat-label">Titles</div></div>
        <div><div class="stat-num">40+</div><div class="stat-label">Genres</div></div>
        <div><div class="stat-num">2M+</div><div class="stat-label">Members</div></div>
      </div>
    </section>

    <div class="marquee-wrap"><div class="marquee-track" id="marquee-track"></div></div>

    <section id="trending">
      <div class="section-header">
        <div>
          <p class="section-label">— Now Trending</p>
          <h2 class="section-title">Top of the Abyss</h2>
          <div class="api-badge"><span class="api-dot"></span> Live · Jikan / MyAnimeList</div>
        </div>
        <a href="https://myanimelist.net/topanime.php" target="_blank" class="view-all">Full Rankings →</a>
      </div>
      <div id="trending-wrap">
        <div class="sk-grid" id="sk-trending">
          <div class="skeleton sk-card"></div><div class="skeleton sk-card"></div>
          <div class="skeleton sk-card"></div><div class="skeleton sk-card"></div>
          <div class="skeleton sk-card"></div><div class="skeleton sk-card"></div>
          <div class="skeleton sk-card"></div><div class="skeleton sk-card"></div>
        </div>
      </div>
    </section>

    <div class="divider"></div>

    <section id="featured">
      <div class="section-header">
        <div>
          <p class="section-label">— Editor's Choice</p>
          <h2 class="section-title">Featured Titles</h2>
        </div>
        <a href="#" class="view-all">Browse All →</a>
      </div>
      <div id="featured-wrap">
        <div style="display:grid;grid-template-columns:1.6fr 1fr 1fr;grid-template-rows:260px 260px;gap:18px;">
          <div class="skeleton" style="grid-row:1/3;border-radius:4px;"></div>
          <div class="skeleton" style="border-radius:4px;"></div>
          <div class="skeleton" style="border-radius:4px;"></div>
          <div class="skeleton" style="border-radius:4px;"></div>
          <div class="skeleton" style="border-radius:4px;"></div>
        </div>
      </div>
    </section>

    <div class="divider"></div>

    <section id="genres">
      <div class="section-header">
        <div>
          <p class="section-label">— Browse by Genre</p>
          <h2 class="section-title">Explore the Depths</h2>
        </div>
      </div>
      <div class="genres-grid" id="genres-grid"></div>
    </section>

    <div class="divider"></div>

    <section id="seasonal">
      <div class="section-header">
        <div>
          <p class="section-label">— Current Season</p>
          <h2 class="section-title" id="season-heading">This Season</h2>
          <div class="api-badge"><span class="api-dot"></span> Live · Jikan / MyAnimeList</div>
        </div>
        <a href="https://myanimelist.net/anime/season" target="_blank" class="view-all">Full Schedule →</a>
      </div>
      <div class="s-tabs">
        <button class="s-tab active" data-f="all">All</button>
        <button class="s-tab" data-f="TV">TV</button>
        <button class="s-tab" data-f="Movie">Movies</button>
        <button class="s-tab" data-f="ONA">ONA</button>
      </div>
      <div id="seasonal-wrap">
        <div class="seasonal-list">
          <div class="skeleton" style="height:106px;border-radius:4px;"></div>
          <div class="skeleton" style="height:106px;border-radius:4px;"></div>
          <div class="skeleton" style="height:106px;border-radius:4px;"></div>
          <div class="skeleton" style="height:106px;border-radius:4px;"></div>
        </div>
      </div>
    </section>

    <section id="newsletter">
      <p class="section-label">— Stay Connected</p>
      <h2 class="section-title">Never Miss an Episode</h2>
      <p style="text-align:center;color:var(--dim);font-size:1rem;font-weight:300;max-width:460px;margin:0 auto;line-height:1.7;">Get weekly updates on new releases, seasonal charts, and curated recommendations.</p>
      <div class="nl-form">
        <input type="email" class="nl-input" placeholder="your@email.com">
        <button class="nl-btn">Subscribe</button>
      </div>
    </section>

    <footer>
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="#" class="logo">Anime Abyss</a>
          <p class="footer-desc">The deepest dive into the world of anime. Discover, track, and share your journey through thousands of titles.</p>
        </div>
        <div class="footer-col"><h4>Discover</h4><ul>
          <li><a href="#">Trending</a></li><li><a href="#">Top Rated</a></li>
          <li><a href="#">Seasonal</a></li><li><a href="#">New Releases</a></li><li><a href="#">Classics</a></li>
        </ul></div>
        <div class="footer-col"><h4>Community</h4><ul>
          <li><a href="#">Forums</a></li><li><a href="#">Reviews</a></li>
          <li><a href="#">Lists</a></li><li><a href="#">Events</a></li>
        </ul></div>
        <div class="footer-col"><h4>Account</h4><ul>
          <li><a href="#">Sign Up</a></li><li><a href="#">Login</a></li>
          <li><a href="#">My List</a></li><li><a href="#">Settings</a></li>
        </ul></div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 Anime Abyss. All rights reserved.</span>
        <span class="footer-jp">深淵に飛び込め</span>
        <span>Privacy · Terms · Contact</span>
      </div>
    </footer>
    </div>
</template>
