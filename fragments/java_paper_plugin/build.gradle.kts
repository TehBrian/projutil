plugins {
    id("java")
    id("com.github.johnrengelman.shadow") version "7.1.2"
    id("xyz.jpenilla.run-paper") version "1.0.6"
    id("net.kyori.indra.checkstyle") version "2.2.0"
}

group = "@PROJECT_GROUP@"
version = "@PROJECT_VERSION@"
description = "@PROJECT_DESCRIPTION@"

java {
    toolchain.languageVersion.set(JavaLanguageVersion.of(17))
}

repositories {
    mavenCentral()
    maven("https://papermc.io/repo/repository/maven-public/") {
        name = "papermc"
    }
}

dependencies {
    compileOnly("io.papermc.paper:paper-api:1.19-R0.1-SNAPSHOT")
}

tasks {
    assemble {
        dependsOn(shadowJar)
    }

    processResources {
        expand("version" to project.version, "description" to project.description)
    }

    shadowJar {
        archiveBaseName.set("@PROJECT_NAME@")
        archiveClassifier.set("")

        val libsPackage = "${project.group}.${project.name}.libs"
        relocate("the.developer.epiclib", "$libsPackage.epiclib")
    }

    runServer {
        minecraftVersion("1.19")
    }
}
