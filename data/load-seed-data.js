const client = require('../lib/client');
// import our seed data:
const films = require('./films.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );
      
    const user = users[0].rows[0];

    await Promise.all(
      films.map(film => {
        return client.query(`
                    INSERT INTO films (title, original_title, description, director, producer, release_date, running_time, rt_score, img, miyazaki, category, owner_id)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                    RETURNING *;
                `,
        [film.title, film.original_title, film.description, film.director, film.producer, film.release_date, film.running_time, film.rt_score, film.img, film.miyazaki, film.category, user.id]);
      })
    );
    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
