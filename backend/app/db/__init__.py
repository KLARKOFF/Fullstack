"""Создание таблиц.

    python -m app.db.init_db           создать недостающие таблицы
    python -m app.db.init_db --seed    то же + демо-данные (если БД пустая)
    python -m app.db.init_db --reset   удалить все таблицы и создать заново (данные пропадут!)
"""

import argparse

from sqlalchemy import select

from app.db.database import Base, SessionLocal, engine
from app.models import Laundry, Machine, MachineType, User, UserRole


def seed() -> None:
    with SessionLocal() as db:
        if db.scalar(select(Laundry.id)) is not None:
            print("В БД уже есть данные, демо-данные не добавлены")
            return

        laundry = Laundry(name="Общежитие №1")
        db.add(laundry)
        db.flush()  # чтобы получить laundry.id

        washers = [(1, 6), (2, 6), (3, 6), (4, 8)]
        dryers = [(5, 8), (6, 8)]
        db.add_all(
            [Machine(laundry_id=laundry.id, number=n, type=MachineType.washer, capacity=c) for n, c in washers]
            + [Machine(laundry_id=laundry.id, number=n, type=MachineType.dryer, capacity=c) for n, c in dryers]
        )
        db.add(User(name="Администратор", email="admin@laundry.ru", role=UserRole.admin, laundry_id=laundry.id))
        db.commit()
        print("Добавлены демо-данные: прачечная, 6 машин, администратор admin@laundry.ru")


def main() -> None:
    parser = argparse.ArgumentParser(description="Создание таблиц БД")
    parser.add_argument("--seed", action="store_true", help="добавить демо-данные")
    parser.add_argument("--reset", action="store_true", help="удалить таблицы и создать заново")
    args = parser.parse_args()

    if args.reset:
        Base.metadata.drop_all(engine)
        print("Таблицы удалены")
    Base.metadata.create_all(engine)
    print("Таблицы созданы")

    if args.seed:
        seed()


if __name__ == "__main__":
    main()