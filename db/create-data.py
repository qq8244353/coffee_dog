import random as rd

# メモ
# 10時から16:30時

def get_random_date():
    day = rd.randint(23, 24)
    lst = []
    hour = rd.randint(10, 16)
    minute = rd.randint(0, 30)
    second = rd.randint(0, 59)
    for i in range(4):
        minute += rd.randint(1, 5)
        second = rd.randint(0, 59)
        datetime = f'"2024-11-{day} {hour}:{minute:02}:{second:02}"'
        lst.append(datetime)
    lst = sorted(lst)
    return (lst[0], lst[1], lst[2], lst[3])

# schema
# 0`id`                   INT(3) AUTO_INCREMENT, ok
# 1`sale_id`              INT(3) NOT NULL, ok
# 2`item_id`              INT(1) NOT NULL,
# 3`register_person_id`   INT(2) NOT NULL,
# 4`registered_at`        Datetime NOT NULL,
# 5`is_created`           BOOLEAN DEFAULT FALSE,
# 6`create_person_id`  INT(2) DEFAULT NULL,
# 7`created_at`       Datetime DEFAULT NULL,
# 8`is_handed_over`       BOOLEAN DEFAULT FALSE,
# 9`hand_over_person_id`  INT(2) DEFAULT NULL,
# 10`handed_over_at`       Datetime DEFAULT NULL,
# 11`is_canceled`          BOOLEAN DEFAULT FALSE,
# 12`cancel_person_id`     INT(2) DEFAULT NULL,
# 13`canceled_at`          Datetime DEFAULT NULL,
sales = []
item_ids = [ 10, 11, 12, 13, 20, 30, 31, 41 ]

l = 5
sale_id = 0
# waiting
for i in range(l):
    registered_at, created_at, handed_over_at, canceled_at = get_random_date()
    d = [ i for i in range(14) ]
    d[2] = item_ids[rd.randint(0, len(item_ids) - 1)]
    d[3] = rd.randint(0, 23)
    d[4] = registered_at
    d[5] =  'FALSE'
    d[6] =  'NULL'
    d[7] =  'NULL'
    d[8] =  'FALSE'
    d[9] =  'NULL'
    d[10] = 'NULL'
    d[11] = 'FALSE'
    d[12] = 'NULL'
    d[13] = 'NULL'
    sales.append(d)
# calling
for i in range(l):
    registered_at, created_at, handed_over_at, canceled_at = get_random_date()
    d = [ i for i in range(14) ]
    d[2] = item_ids[rd.randint(0, len(item_ids) - 1)]
    d[3] = rd.randint(0, 23)
    d[4] = registered_at
    d[5] =  'TRUE'
    d[6] = rd.randint(0, 23)
    d[7] = created_at
    d[8] =  'FALSE'
    d[9] =  'NULL'
    d[10] = 'NULL'
    d[11] = 'FALSE'
    d[12] = 'NULL'
    d[13] = 'NULL'
    sales.append(d)
# handed over
for i in range(l):
    registered_at, created_at, handed_over_at, canceled_at = get_random_date()
    d = [ i for i in range(14) ]
    d[2] = item_ids[rd.randint(0, len(item_ids) - 1)]
    d[3] = rd.randint(0, 23)
    d[4] = registered_at
    d[5] = 'TRUE'
    d[6] = rd.randint(0, 23)
    d[7] = created_at
    d[8] = 'TRUE'
    d[9] = rd.randint(0, 23)
    d[10] = handed_over_at
    d[11] = 'FALSE'
    d[12] = 'NULL'
    d[13] = 'NULL'
    sales.append(d)
# canceled
for i in range(l):
    registered_at, created_at, handed_over_at, canceled_at = get_random_date()
    d = [ i for i in range(14) ]
    d[2] = item_ids[rd.randint(0, len(item_ids) - 1)]
    d[3] = rd.randint(0, 23)
    d[4] = registered_at
    d[5] =  'FALSE'
    d[6] =  'NULL'
    d[7] =  'NULL'
    d[8] =  'FALSE'
    d[9] =  'NULL'
    d[10] = 'NULL'
    d[11] = 'TRUE'
    d[12] = d[3]
    d[13] = created_at
    sales.append(d)

sales = sorted(sales, key=lambda x: x[4])
for d in sales:
    d[1] = sale_id
    if rd.randint(0, 10) >= 1:
        sale_id += 1

print(f'INSERT INTO sales\n  (sale_id, item_id, register_person_id, registered_at, is_created, create_person_id, created_at, is_handed_over, hand_over_person_id, handed_over_at, is_canceled, cancel_person_id, canceled_at)\nVALUES')
for i in range(len(sales)):
    print('  (', end="")
    now = ""
    for j in range(1, len(sales[i])):
        if j > 1:
            now += ', '
        now += str(sales[i][j])
    print(now, end="")
    print('  )', end="")
    if i + 1 == len(sales):
        print(';')
    else:
        print(',')
