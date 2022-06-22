class FilmDTO {
    constructor(data) {
        this.id = data.id
        this.nation = data.areaNameList[0]
        this.type = data.category
        this.title = data.name
        this.score = data.score
        this.tags = data.tagNameList
        this.background = data.coverHorizontalUrl
        this.image = data.coverVerticalUrl
        this.episodes = data.episodeVo // array { id, definitionList, subtitlingList }
        this.introduction = data.introduction
        this.recommend = data.likeList
        this.year = data.year
        this.stars = data.starList
    }
}

module.exports = FilmDTO