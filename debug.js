const cheerio = require('cheerio')
const fs = require('fs')

fs.readFile('data.html', 'utf-8', (err, data) => {
    const main = cheerio.load(data)
    const featuredMovies = main('div[id=featured]').find('.ml-item').children()
    const result = []

    for (const movies in featuredMovies) {
        if (featuredMovies.hasOwnProperty(movies)) {
            const element = featuredMovies[movies];
            let movie = {}

            if (element.attribs && element.attribs.href) {
                movie.title = element.attribs.title
                movie.link = element.attribs.href

                const movieDetail = element.children
                movieDetail.forEach(mov => {
                    if (mov.attribs && mov.attribs.class) {
                        movie = { ...movie, ...detailCategory(mov) }
                    }
                })
                result.push(movie)
            }

        }
    }

    console.log(result)

})


const detailCategory = (raw) => {
    if (/thumb/g.test(raw.attribs.class)) {
        return { thumb: raw.attribs['data-original'] }
    }
    if (/quality/g.test(raw.attribs.class)) {
        return { quality: raw.children[0].data }
    }
    if (/rating/g.test(raw.attribs.class)) {
        return {
            rating: raw.children[0].children[1].data,
            duration: raw.children[1].children[1].data,
        }
    }
    if (/info/g.test(raw.attribs.class)) {
        return { title: raw.children[1].children[0].data }
    }

    if (/subtitle/g.test(raw.attribs.class)) return {}
    return {}
}
