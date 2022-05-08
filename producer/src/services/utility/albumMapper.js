const albumMapper = ({ id, name, year, cover_url }) => {
    return { id, name, year, coverUrl: cover_url };
};

module.exports = { albumMapper };
