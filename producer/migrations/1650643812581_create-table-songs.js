exports.up = (pgm) => {
    pgm.createTable("songs", {
        id: {
            type: "VARCHAR(50)",
            primaryKey: true,
        },
        title: {
            type: "VARCHAR(50)",
            notNull: true,
        },
        year: {
            type: "INTEGER",
            notNull: true,
        },
        genre: {
            type: "VARCHAR(50)",
            notNull: true,
        },
        performer: {
            type: "VARCHAR(50)",
            notNull: true,
        },
        duration: {
            type: "INTEGER",
        },
        album_id: {
            type: "VARCHAR(50)",
        },
        created_at: {
            type: "TIMESTAMP",
            notNull: true,
            default: pgm.func("current_timestamp"),
        },
        updated_at: {
            type: "TIMESTAMP",
            notNull: true,
            default: pgm.func("current_timestamp"),
        },
    });

    // memberikan constraint foreign key pada kolom album_id terhadap albums.id
    pgm.addConstraint("songs", "fk_songs.album_id_albums.id", "FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE");
};

exports.down = (pgm) => {
    pgm.dropTable("songs");
};
