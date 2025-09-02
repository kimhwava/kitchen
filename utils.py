import sqlite3
DB_PATH = 'database/food.db'

def calculate_cost(menu_id):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        SELECT mi.quantity, i.price_per_unit
        FROM menu_ingredients mi
        JOIN ingredients i ON mi.ingredient_id = i.id
        WHERE mi.menu_id = ?
    ''', (menu_id,))
    rows = c.fetchall()
    conn.close()
    return round(sum(q * p for q, p in rows), 2)
