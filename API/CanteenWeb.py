from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
import re

class CanteenWeb:
    url = 'https://strav.nasejidelna.cz/0341/login'

    def __init__(self):
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--no-sandbox")

        self.driver = webdriver.Chrome(options=chrome_options)

    def login(self,username,password):
        self.driver.get(self.url)

        username_input_id = 'j_username'
        password_input_id = 'j_password'
        submit_class = 'input.btn.btn-primary.btn-login'

        if username == '' or username is None:
            raise ValueError('username cannot be empty')
        if password == '' or password is None:
            raise ValueError('password cannot be empty')

        input_field = self.driver.find_element(By.ID, username_input_id)
        input_field.send_keys(username)

        password_field = self.driver.find_element(By.ID, password_input_id)
        password_field.send_keys(password)

        login_button = self.driver.find_element(By.CSS_SELECTOR, submit_class)
        login_button.click()

        return self.driver.title == 'iCanteen - objednání stravy'

    def get_lunches(self):
        self.driver.get(self.url)

        lunch_day_class = 'jidelnicekDen'
        days = self.driver.find_elements(By.CLASS_NAME, lunch_day_class)
        output = {}
        for index, day in enumerate(days):
            date = day.find_element(By.XPATH, "./*").text
            date = re.findall(r'\d\d.\d\d.\d\d\d\d',date)[0]

            daily_lunches = day.find_element(By.XPATH, "./*[2]")
            lunch = daily_lunches.find_element(By.XPATH, f"./*[5]")
            lunch = lunch.find_element(By.XPATH, "./*[3]").text
            if lunch == '':
                break
            lunch = re.split(r'\(.+\)',lunch)[0]
            lunch = re.split(r',\s', lunch)
            soup = lunch[0].strip()
            drink = lunch[-1].strip()
            main1 = ' '.join(lunch[1:-1]).strip()

            lunch = daily_lunches.find_element(By.XPATH, f"./*[6]")
            lunch = lunch.find_element(By.XPATH, "./*[3]").text
            lunch = re.split('\(.+\)', lunch)[0]
            lunch = re.split(r',\s', lunch)
            main2 = ' '.join(lunch[1:-1]).strip()

            output[index] = {
                'date': date,
                'soup': soup,
                'main1': main1,
                'main2': main2,
                'drink': drink
            }
        print(output)
        return output
