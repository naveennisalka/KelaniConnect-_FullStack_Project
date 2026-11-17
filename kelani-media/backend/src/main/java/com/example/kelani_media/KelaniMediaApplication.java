package com.example.kelani_media;

import com.example.kelani_media.config.DotenvLoader;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class KelaniMediaApplication {

	static {
		DotenvLoader.load();
	}

	public static void main(String[] args) {
		DotenvLoader.load();
		SpringApplication.run(KelaniMediaApplication.class, args);
	}

}
