plugins {
    `java-library`
    id("net.kyori.indra")
    id("net.kyori.indra.checkstyle")
    id("net.kyori.indra.publishing")
}

group = rootProject.group
version = rootProject.version
description = rootProject.description

dependencies {
  implementation("org.jspecify:jspecify:1.0.0")
}

indra {
    javaVersions {
        target(21)
    }

    github(/* account */, /* repo */)

    mitLicense()
    
    publishReleasesTo(/* name */, /* url */)
    publishSnapshotsTo(/* name */, /* url */)

    configurePublications{
        pom {
            url.set("@PROJECT_WEBSITE@")

            developers {
                developer {
                    name.set("@DEVELOPER_NAME@")
                    url.set("@DEVELOPER_URL@")
                    email.set("@DEVELOPER_EMAIL@")
                }
            }

            scm {
                connection.set("scm:git:git://@PROJECT_GIT_REPO@.git")
                developerConnection.set("scm:git:ssh://@PROJECT_GIT_REPO@.git")
                url.set("@PROJECT_GIT_REPO@.git")
            }
        }
    }
}
