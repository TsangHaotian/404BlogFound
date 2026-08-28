package com.tsanghaotian.blog404;

import android.app.Activity;
import android.graphics.Color;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;

public class MainActivity extends Activity {

    private static final String BLOG_URL = "https://tsanghaotian.github.io/404BlogFound/";

    private WebView webView;
    private float statusBarHeightDp = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 状态栏/导航栏透明,网页全屏沉浸,顶部间距由网页自己控制
        getWindow().setStatusBarColor(Color.TRANSPARENT);
        getWindow().setNavigationBarColor(Color.TRANSPARENT);

        FrameLayout root = new FrameLayout(this);
        // 容器底色与博客背景色一致,页面加载完成前不显突兀
        root.setBackgroundColor(Color.parseColor("#0d1017"));
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

        // Android WebView 的 env(safe-area-inset-top) 恒为 0,
        // 由壳把真实状态栏高度注入 CSS 变量 --native-safe-top,网页优先使用它
        statusBarHeightDp = getStatusBarHeightDp();
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                view.evaluateJavascript(
                        "document.documentElement.style.setProperty('--native-safe-top','"
                                + statusBarHeightDp + "px')", null);
            }
        });

        webView.loadUrl(BLOG_URL);
    }

    private float getStatusBarHeightDp() {
        int id = getResources().getIdentifier("status_bar_height", "dimen", "android");
        int px = id > 0 ? getResources().getDimensionPixelSize(id)
                : (int) (24 * getResources().getDisplayMetrics().density);
        return px / getResources().getDisplayMetrics().density;
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
