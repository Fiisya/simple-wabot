let handler = async (m, {
    conn,
    usedPrefix,
    text,
    args,
    command
}) => {
    if (!text) throw "*Example :* .pin [input query]";
    conn.sendMessage(m.chat, {
        react: {
            text: '⏳',
            key: m.key
        }
    });
    try {
        const pinterest = {
    api: {
        base: "https://www.pinterest.com",
        endpoints: {
            search: "/resource/BaseSearchResource/get/",
            pin: "/resource/PinResource/get/",
            user: "/resource/UserResource/get/"
        }
    },

    headers: {
        'accept': 'application/json, text/javascript, */*, q=0.01',
        'referer': 'https://www.pinterest.com/',
        'user-agent': 'Postify/1.0.0',
        'x-app-version': 'a9522f',
        'x-pinterest-appstate': 'active',
        'x-pinterest-pws-handler': 'www/[username]/[slug].js',
        'x-pinterest-source-url': '/search/pins/?rs=typed&q=kucing%20anggora/',
        'x-requested-with': 'XMLHttpRequest'
    },
    getCookies: async () => {
        try {
            const response = await axios.get(pinterest.api.base);
            const setHeaders = response.headers['set-cookie'];
            if (setHeaders) {
                const cookies = setHeaders.map(cookieString => {
                    const cp = cookieString.split(';');
                    const cv = cp[0].trim();
                    return cv;
                });
                return cookies.join('; ');
            }
            return null;
        } catch (error) {
            console.error(error);
            return null;
        }
    },
    search: async (query, limit = 15) => {
            const cookies = await pinterest.getCookies();
            const params = {
                source_url: `/search/pins/?q=${query}`,
                data: JSON.stringify({
                    options: {
                        isPrefetch: false,
                        query: query,
                        scope: "pins",
                        bookmarks: [""],
                        no_fetch_context_on_resource: false,
                        page_size: limit
                    },
                    context: {}
                }),
                _: Date.now()
            };
            const { data } = await axios.get(`${pinterest.api.base}${pinterest.api.endpoints.search}`, {
                headers: { ...pinterest.headers, 'cookie': cookies },
                params: params
            });
            const container = [];
            const results = data.resource_response.data.results.filter((v) => v.images?.orig);     
            results.forEach((result) => {
                container.push({
                    id: result.id,
                    title: result.title || "",
                    description: result.description,
                    pin_url: `https://pinterest.com/pin/${result.id}`,
                    gambar: result.images.orig,
                });
            });

            return {
                status: true,
                code: 200,
                result: {
                    query: query,
                    total: container.length,
                    pins: container
                }
            };
        }
    }
            let data = await pinterest.search(text)
            let results = data.result.pins;
            let array = []
            for (let i = 1; i < 12; i++) {
                const randomResult = results[i];
                array.push([`*乂 P I N T R E S T - S L I D E*
  ◦  *Title* : ${randomResult.title}
  ◦  *Url* : ${randomResult.pin_url}  
  ◦  *Result Ke* : ${array.length} */* 10`, wm, randomResult.gambar.url, [], [], [["Download Image", randomResult.gambar.url]] ])
            }
            conn.sendCarousel(m.chat, array, m, {
                body: `*Search From :* ${text}\n*Total Pothos :* 10\n*Total Result:* 15` });
    } catch (error) {
        console.log(error);
        m.reply("Terjadi kesalahan saat menjalankan perintah.");
    }
};

handler.help = ["pinterest""].map((a) => a + " *[query]*");
handler.tags = ["internet"];
handler.command = ["pinterest", "pin", "pin_slide", "pinslide"];

module.exports = handler;
