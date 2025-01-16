document.getElementById("genbut").addEventListener("click", function() {
    const inputText = document.getElementById("inputText").value.trim();
    const passwordLength = document.getElementById("passwordLength").value;
    const includeUppercase = document.getElementById("includeUppercase").checked;
    const includeNumbers = document.getElementById("includeNumbers").checked;

    if (inputText === "") {
        alert("Поле ввода текста не может быть пустым. Введите текст.");
        return;
    }

    const transliterated = transliterate(inputText);
    const password = generatePassword(transliterated, passwordLength, includeUppercase, includeNumbers);
    document.getElementById("outputPassword").textContent = password;
});

document.getElementById("passwordLength").addEventListener("input", function() {
    document.getElementById("lengthValue").textContent = this.value;
});

// Функции
function transliterate(text) {
    const transliterationMap = {
        "а": "a", "б": "b", "в": "v", "г": "g", "ґ": "g", "д": "d", "е": "e", "є": "ie", "ж": "zh",
        "з": "z", "и": "y", "і": "i", "ї": "yi", "й": "i", "к": "k", "л": "l", "м": "m", "н": "n", 
        "о": "o", "п": "p", "р": "r", "с": "s", "т": "t", "у": "u", "ф": "f", "х": "h", "ц": "ts",
        "ч": "ch", "ш": "sh", "щ": "shch", "ю": "yu", "я": "ya",
    };

    return text.toLowerCase().split("").map(char => transliterationMap[char] || char).join("");
}

function generatePassword(transliterated, length, includeUppercase, includeNumbers) { 
    const replacementsNumbers = {"e": "3", "i": "1", "o": "0", "s": "5"}; // Массив для цифр
    const replacementsSymbols = {"a": "@", "s": "$"}; // Массив для символов
    
    // Проверяем, нужно ли дополнять пароль или нет
    let password = transliterated.split("").slice(0, length).map((char) => {
        let randomNumber = Math.random();
        
        // Если разрешены цифры и символ есть в карте замен, заменяем его с вероятностью 50%
        if (includeNumbers && replacementsNumbers[char] && randomNumber > 0.5) {
            return replacementsNumbers[char];
        // Если символ может быть заменён на символ, делаем замену с вероятностью 50%
        } else if (includeNumbers && replacementsSymbols[char] && randomNumber > 0.5) {
            return replacementsSymbols[char];
        }
        return char; // Если нет условий для изменения символа, оставляем его как есть
    }).join("");

    // Если длина пароля меньше заданной длины, дополняем его случайными символами
    if (password.length < length) {
        while (password.length < length) {
            let randomChar = "";
            let randomNumber = Math.random();

            // Если отключены как цифры, так и заглавные буквы, генерируем только строчные буквы
            if (!includeUppercase && !includeNumbers) {
                randomChar = String.fromCharCode(Math.floor(Math.random() * 26) + 97); // Только строчные буквы
            }
            // Если включены цифры, с вероятностью 50% добавляем случайную цифру
            else if (includeNumbers && randomNumber < 0.5) {
                randomChar = Math.floor(Math.random() * 10).toString(); // Генерируем случайную цифру
            } else {
                // Если включены заглавные буквы, добавляем случайную букву (строчную)
                randomChar = String.fromCharCode(Math.floor(Math.random() * 26) + 97); // Генерируем случайную букву
            }

            password += randomChar; // Добавляем случайный символ к паролю
        }
    }

    // Если включены заглавные буквы, делаем первую и последнюю букву заглавными
    if (includeUppercase && password.length > 0) {
        password = password[0].toUpperCase() + password.slice(1, -1) + password.slice(-1).toUpperCase();
    }

    return password;
}
