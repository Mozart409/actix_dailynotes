use actix_cors::Cors;
use actix_web::{get, http::header, middleware::Logger, post, web, App, HttpServer, Responder};
use serde::{Deserialize, Serialize};
use sqlx::migrate::Migrator;
use sqlx::sqlite::SqlitePool;
use std::env;

#[derive(Debug, Clone)]
struct AppState {
    pool: SqlitePool,
}

#[get("/")]
async fn index() -> impl Responder {
    "Hello world!"
}

#[derive(Debug, Serialize, Deserialize)]
struct Healthcheck {
    status: String,
    database: String,
}

#[get("/_healthcheck")]
async fn healthcheck(data: web::Data<AppState>) -> web::Json<Healthcheck> {
    let pool = &data.pool;
    match sqlx::query("SELECT 1").fetch_one(pool).await {
        Ok(_) => web::Json(Healthcheck {
            status: "ok".to_string(),
            database: "ok".to_string(),
        }),
        Err(e) => web::Json(Healthcheck {
            status: "error".to_string(),
            database: e.to_string(),
        }),
    }
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
struct User {
    id: i32,
    username: String,
    email: String,
    password: String,
    created_at: String,
    updated_at: String,
}

#[get("/users")]
async fn get_users(data: web::Data<AppState>) -> web::Json<Vec<User>> {
    let pool = &data.pool;
    let users = sqlx::query_as::<_, User>("SELECT * FROM users ORDER BY id DESC LIMIT 10")
        .fetch_all(pool)
        .await
        .expect("Failed to fetch users");

    web::Json(users)
}

#[derive(Debug, Serialize, Deserialize)]
struct CreateUser {
    username: String,
    email: String,
    password: String,
}

#[post("/users")]
async fn create_user(params: web::Form<CreateUser>, data: web::Data<AppState>) -> impl Responder {
    let pool = &data.pool;

    let result = sqlx::query!(
        r#"
        INSERT INTO users (username, email, password)
        VALUES (?1, ?2, ?3)
        "#,
        params.username,
        params.email,
        params.password
    )
    .execute(pool)
    .await;

    match result {
        Ok(_) => "User created",
        Err(e) => {
            log::error!("Failed to create user: {:?}", e);
            "Failed to create user"
        }
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init_from_env(env_logger::Env::default().default_filter_or("debug"));

    let pool = SqlitePool::connect(&env::var("DATABASE_URL").expect("DATABASE_URL must be set"))
        .await
        .expect("Failed to connect to database");

    sqlx::migrate!()
        .run(&pool)
        .await
        .expect("Failed to migrate database");

    log::info!("Migrations applied");
    let state = AppState { pool };

    log::info!("starting HTTP server at http://localhost:8080");

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(state.clone()))
            .wrap(
                Cors::default()
                    .allowed_origin("http://localhost:8081")
                    .allowed_methods(vec!["GET", "POST"])
                    .allowed_headers(vec![header::AUTHORIZATION, header::ACCEPT])
                    .allowed_header(header::CONTENT_TYPE)
                    .supports_credentials()
                    .max_age(3600),
            )
            .wrap(Logger::default())
            .service(index)
            .service(healthcheck)
            .service(get_users)
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
