plugins {
    id("java")
    id("com.gradleup.shadow") version "8.3.0"
    id("xyz.jpenilla.run-paper") version "2.3.0"
    id("net.kyori.indra.checkstyle") version "3.1.3"
    id("com.github.ben-manes.versions") version "0.51.0"
}

group = "@PROJECT_GROUP@"
version = "@PROJECT_VERSION@"
description = "@PROJECT_DESCRIPTION@"

java {
    toolchain.languageVersion.set(JavaLanguageVersion.of(21))
}

repositories {
    mavenCentral()
    maven("https://papermc.io/repo/repository/maven-public/")

}

dependencies {
    compileOnly("io.papermc.paper:paper-api:1.21.1-R0.1-SNAPSHOT")
}

tasks {
    assemble {
        dependsOn(shadowJar)
    }

    processResources {
        filesMatching("plugin.yml") {
            expand(
                "version" to project.version,
                "description" to project.description
            )
        }
    }

    base {
		archivesName.set("@PROJECT_NAME@")
	}

    shadowJar {
        archiveClassifier.set("")

        val libsPackage = "${project.group}.${project.name}.libs"
        fun moveToLibs(vararg patterns: String) {
            for (pattern in patterns) {
                relocate(pattern, "$libsPackage.$pattern")
            }
        }

        moveToLibs(
            "love.broccolai.corn",
            "dev.tehbrian.tehlib",
        )
    }

    runServer {
        minecraftVersion("1.21.1")
    }
}
