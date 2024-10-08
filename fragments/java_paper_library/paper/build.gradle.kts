plugins {
    id("@ROOT_PROJECT_NAME@.java-conventions")
}

repositories {
    maven("https://papermc.io/repo/repository/maven-public/")
}

dependencies {
    api(project(":@ROOT_PROJECT_NAME@-core"))

    compileOnly("io.papermc.paper:paper-api:1.21.1-R0.1-SNAPSHOT")
}
