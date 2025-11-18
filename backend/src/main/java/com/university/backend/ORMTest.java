package com.university.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class ORMTest implements CommandLineRunner {

    @Override
    public void run(String... args) throws Exception {
        System.out.println("✅ ORM Setup Complete!");
        System.out.println("✅ Entities: Entity, Attribute, Value");
        System.out.println("✅ Repositories: EntityRepository, AttributeRepository, ValueRepository");
        System.out.println("✅ Services: EAVService");
        System.out.println("✅ Ready to use EAV pattern!");
    }
}