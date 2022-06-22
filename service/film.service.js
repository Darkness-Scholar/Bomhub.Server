const axios = require("axios")
const FilmDTO = require("../DTO/filmDTO")

var baseURL = "https://ga-mobile-api.loklok.tv"
var headers = {
    lang: 'en',
    versioncode: '11',
    clienttype: 'ios_jike_default'
}

    const toprate = async (req, res) => {
        console.log("GET TOP RATE")
        try {
            let { data } = await axios.get(baseURL + "/cms/app/homePage/getHome?page=0", { headers })
            let queryData = data.data.recommendItems
            let { recommendContentVOList } = queryData.find(item => item.homeSectionType === 'BANNER')
            let result = []
            recommendContentVOList.map(item => {
                let param = (new URL(item.jumpAddress)).searchParams;
                let id = param.get('id')
                let type = param.get('type')
                if (type) result.push({ title: item.title, image: item.imageUrl, id, type })
            })
            
            return res.status(200).json({ result })
        } catch (error) {
            console.log("Cannot get", error)
        }
    }

    const trending = async (req, res) => {
        console.log("GET TRENDING")
        let page = req.query.page || 0
        try {
            let { data } = await axios.get(baseURL + `/cms/app/homePage/getHome?page=${page}`, { headers })
            let result = {/* item: array of { title, image, id, type } */ }
            data?.data?.recommendItems.slice(1).map(item => {
                result[item.homeSectionName] = item.recommendContentVOList // là 1 mảng chứa các film
            })
            return res.status(200).json(result)
        } catch (error) {
            console.log("Cannot get", error)
        }

    }

    const filmDetail = async (req, res) => {
        let { id, type } = req.query
        console.log(id, type)
        if (!id && !type) return res.status(400).json({ msg: "Missing id and type" })
        try {
            let { data } = await axios.get(baseURL + `/cms/app/movieDrama/get?id=${id}&category=${type}`, { headers })
            let result = new FilmDTO(data.data)
            return res.status(200).json(result)
        } catch (error) {
            console.log("Cannot get", error)
        }
    }

    const episode = async (req, res) => {
        let { type, id, eid, definition } = req.query
        console.log(type, id)
        try {
            let { data } = await axios
            .get(
                baseURL + `/cms/app/media/previewInfo?category=${type}&contentId=${id}&episodeId=${eid}&definition=${definition}`,
                { headers }
            )
            return res.status(200).json(data)
        } catch (error) {

        }
    }

    const trailer = async (req, res) => {
        let { type, id, eid, definition } = req.query
        try {
            let { data } = await axios.post(baseURL + "/cms/app/media/bathGetplayInfo",
                [{"category": type, "contentId": id, "episodeId": eid, "definition":definition||"GROOT_LD"}]
            , { headers })

            return res.status(200).json(data)
        } catch (error) {
            
        }
    }

    const basicSearch = async (req, res) => {
        let { keyword, size, type } = req.body
        console.log("SEARCH <BASIC>", req.body)
        if (!keyword) return res.status(400).json({ msg: "Keyword is required" })
        let search = {
            "searchKeyWord": keyword, 
            "size": size || 30, 
            "sort": "", 
            "searchType": type || "" // Drama, Movie, Star
        }
        try {
            let { data } = await axios.post(baseURL + "/cms/app/search/v1/searchWithKeyWord", {...search}, { headers })
            console.log(data?.data)
            let films = data.data.searchResults.map(item => {
                return {
                    type: item.domainType===1?"drama":"movie",
                    background: item.coverHorizontalUrl,
                    image: item.coverVerticalUrl,
                    id: item.id,
                    title: item.name,
                    year: item.releaseTime
                }
            })
            let stars = data.data.starResults

            // console.log(films);
            
            return res.status(200).json({films, stars})
        } catch (err) {
            return res.status(404).json({ msg: "Error" })
        }
    }

    const advanceSearch = async (req, res) => {
        try {
            let { data } = await axios.post(baseURL + "/cms/app/search/v1/search", {
                size: req.body.size || 30,
                params: req.body.size || "MOVIE,TVSPECIAL",
                area: req.body.area || "",
                category: req.body.category || "",
                year: req.body.year || "",
                subtitles: "",
                order: "up"
            }, { headers })
            return res.status(200).json(data)
        } catch (err) {
            return res.status.json({ msg: "Error" })
        }
    }

module.exports = { toprate, trending, filmDetail, episode, trailer, basicSearch, advanceSearch }