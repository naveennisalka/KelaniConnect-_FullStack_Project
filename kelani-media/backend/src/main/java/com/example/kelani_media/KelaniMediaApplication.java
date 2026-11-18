package com.example.kelani_media;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.example.kelani_media.config.DotenvLoader;

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
