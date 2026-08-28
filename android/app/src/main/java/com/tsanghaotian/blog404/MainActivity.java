package com.tsanghaotian.blog404;

import android.app.Activity;
import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;

public class MainActivity extends Activity {

    private static final String BLOG_URL = "https://tsanghaotian.github.io/404BlogFound/";

    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 状态栏透明,博客自身深色背景透上来,视觉统一
        getWindow().setStatusBarColor(Color.TRANSPARENT);
        getWindow().setNavigationBarColor(Color.TRANSPARENT);

        // 用 FrameLayout 包一层,在容器上留白比在 WebView 上更可靠
        FrameLayout root = new FrameLayout(this);
        webView = new WebView(this);
        root.addView(webView, new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT));
        setContentView(root);

        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        // 遵守 HTTP 缓存头(GitHub Pages 缓存 10 分钟),到期自动拉取最新内容
        // 不要用 LOAD_CACHE_ELSE_NETWORK,它会无视缓存头一直用旧缓存
        s.setCacheMode(WebSettings.LOAD_DEFAULT);

        webView.setWebViewClient(new WebViewClient());

        // 按状态栏/导航栏实际高度留白,顶部额外再加 8dp,避免挖孔屏机型内容贴边
        final int extraTop = (int) (8 * getResources().getDisplayMetrics().density);
        root.setOnApplyWindowInsetsListener((v, insets) -> {
            v.setPadding(0, insets.getSystemWindowInsetTop() + extraTop, 0, insets.getSystemWindowInsetBottom());
            return insets;
        });
        root.requestApplyInsets();

        webView.loadUrl(BLOG_URL);
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
