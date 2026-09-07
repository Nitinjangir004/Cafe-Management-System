package com.cafe.management.config;

import com.cafe.management.entity.CafeBill;
import com.cafe.management.entity.Product;
import com.cafe.management.entity.ProductCategory;
import com.cafe.management.entity.User;
import com.cafe.management.repository.CafeBillRepository;
import com.cafe.management.repository.ProductCategoryRepository;
import com.cafe.management.repository.ProductRepository;
import com.cafe.management.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final ProductCategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CafeBillRepository cafeBillRepository;

    public DataInitializer(UserRepository userRepository,
                           ProductCategoryRepository categoryRepository,
                           ProductRepository productRepository,
                           CafeBillRepository cafeBillRepository) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.cafeBillRepository = cafeBillRepository;
    }

    @Override
    public void run(String... args) {
        initUsers();
        initCategoriesAndProducts();
        initSampleBills();
    }

    private void initUsers() {
        if (userRepository.count() > 0) return;

        User admin = new User(null, "Admin User", "9876543210", "admin@mail.com", "admin", "true", "admin");
        User staff = new User(null, "John Doe", "9876543211", "user@mail.com", "user", "true", "user");
        User pending = new User(null, "Guest User", "9876543212", "guest@mail.com", "guest", "false", "user");

        userRepository.saveAll(Arrays.asList(admin, staff, pending));
        log.info("Initialized default users: admin@mail.com (admin), user@mail.com (user)");
    }

    private void initCategoriesAndProducts() {
        if (categoryRepository.count() > 0) return;

        ProductCategory catPizza = new ProductCategory(null, "Pizza");
        ProductCategory catBiryani = new ProductCategory(null, "Biryani");
        ProductCategory catPasta = new ProductCategory(null, "Pasta");
        ProductCategory catDessert = new ProductCategory(null, "Dessert");
        ProductCategory catCoffee = new ProductCategory(null, "Coffee");
        ProductCategory catBeverages = new ProductCategory(null, "Beverages");

        categoryRepository.saveAll(Arrays.asList(catPizza, catBiryani, catPasta, catDessert, catCoffee, catBeverages));

        List<Product> products = Arrays.asList(
                new Product(null, "Wood-fired Margherita Pizza", catPizza,
                        "Pizza is an Italian dish consisting of a usually round, flattened base of leavened wheat-based dough topped with tomatoes, cheese, and baked at high temperature.",
                        new BigDecimal("299.00"), "true"),
                new Product(null, "Spicy Pepperoni & Jalapeno Pizza", catPizza,
                        "Crispy crust layered with rich tomato marinara, mozzarella, and spicy Italian pepperoni slices.",
                        new BigDecimal("389.00"), "true"),
                new Product(null, "Royal Dum Biryani", catBiryani,
                        "Biryani is a mixed rice dish made with Indian spices, basmati rice, and slow-cooked aromatic saffron herbs.",
                        new BigDecimal("349.00"), "true"),
                new Product(null, "Hyderabadi Spiced Biryani", catBiryani,
                        "Slow-cooked basmati rice infused with whole roasted spices, fried onions, and fresh mint.",
                        new BigDecimal("369.00"), "true"),
                new Product(null, "Creamy Alfredo Pasta", catPasta,
                        "Pasta made from unleavened dough of wheat flour, boiled and tossed in a rich parmesan garlic cream sauce.",
                        new BigDecimal("269.00"), "true"),
                new Product(null, "Spicy Arrabbiata Penne", catPasta,
                        "Penne pasta tossed in a fiery, garlic-infused spicy tomato sauce with fresh basil leaves.",
                        new BigDecimal("249.00"), "true"),
                new Product(null, "Molten Chocolate Lava Cake", catDessert,
                        "Molten chocolate cake is a popular dessert that combines elements of chocolate cake with a warm liquid chocolate center.",
                        new BigDecimal("199.00"), "true"),
                new Product(null, "New York Blueberry Cheesecake", catDessert,
                        "Rich and creamy baked cheesecake topped with a tart wild blueberry compote.",
                        new BigDecimal("220.00"), "true"),
                new Product(null, "Artisanal Espresso", catCoffee,
                        "Bold double-shot espresso brewed from freshly ground single-origin Arabica beans.",
                        new BigDecimal("120.00"), "true"),
                new Product(null, "Velvet Cappuccino", catCoffee,
                        "Rich espresso topped with velvety textured micro-foam and dusted with Dutch cocoa powder.",
                        new BigDecimal("160.00"), "true"),
                new Product(null, "Iced Caramel Macchiato", catCoffee,
                        "Layered chilled milk, vanilla syrup, espresso, and golden caramel drizzle.",
                        new BigDecimal("190.00"), "true")
        );

        productRepository.saveAll(products);
        log.info("Initialized {} categories and {} products including Best Sellers.", 6, products.size());
    }

    private void initSampleBills() {
        if (cafeBillRepository.count() > 0) return;

        String sampleDetails = "[{\"name\":\"Wood-fired Margherita Pizza\",\"category\":\"Pizza\",\"price\":299,\"quantity\":1,\"total\":299},{\"name\":\"Molten Chocolate Lava Cake\",\"category\":\"Dessert\",\"price\":199,\"quantity\":1,\"total\":199}]";

        CafeBill bill1 = new CafeBill(
                null,
                "BILL-1709789001-A1",
                "Sarah Connor",
                "sarah@example.com",
                "9876543210",
                "Credit Card",
                new BigDecimal("498.00"),
                sampleDetails,
                "Admin User",
                LocalDateTime.now().minusHours(2)
        );

        cafeBillRepository.save(bill1);
        log.info("Initialized sample cafe bill.");
    }
}
