import React, { FC, useState, useEffect } from "react";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Input} from "@mui/material";
import { IAnimal } from '../api/animals'
import { v4 as uuid } from 'uuid';
import search from '../icons/search.svg'
import sort from '../icons/sort.svg'
import jsonData from '../data/data.json'
import Modal from 'react-modal'

const AnimalDataManager: FC = function () {
    const [data, setData] = useState<IAnimal[]>([]);
    const [newName, setNewName] = useState<string>("");
    const [newBirthYear, setNewBirthYear] = useState<number | undefined>(0);
    const [newSpecies, setNewSpecies] = useState<string>("");
    const [newFavouriteFood, setNewFavouriteFood] = useState<string>("");
    const [newColor, setNewColor] = useState<string>("");
    const [allData, setAllData] = useState<IAnimal[]>([]);
    const [searchName, setSearchName] = useState<string>("");

    useEffect(() => {
        setAllData(jsonData as IAnimal[]);
    }, [])

    useEffect(() => {
        setData(allData);
    }, [allData]);

    const handleAdd = function (e: Event) {
        e.preventDefault();
        const updatedData = [...allData, { id: uuid(), name: newName, birthYear: newBirthYear === 0 ? undefined : newBirthYear, species: newSpecies, favouriteFood: newFavouriteFood, color: newColor }];
        setAllData(updatedData);
        setData(allData);
        setNewName("");
        setNewBirthYear(0);
        setNewSpecies("");
        setNewFavouriteFood("");
        setNewColor("");
    }

    const handleSearch = function (query: string): void {
        setSearchName(query);
        if (query.trim().length === 0) {
            setData(allData);
            return;
        }

        const filteredData = allData.filter(data => data.name.toLowerCase().includes(query.toLowerCase()));
        setData(filteredData);
    }

    return (
        <>
            <div className="flex justify-center">
                <div className="min-w-[70%] flex flex-col items-center">
                    <form className="min-w-[50%]" onSubmit={handleAdd}>
                        <Input
                            className="!min-w-[100%] !bg-gray-600 !rounded-lg !text-white !p-2 !mt-3"
                            type="text"
                            inputProps={{required: true}}
                            placeholder="NAME"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                        <Input
                            className="!min-w-[100%] !bg-gray-600 !rounded-lg !text-white !p-2 !mt-3"
                            type="number"
                            inputProps={{min: 0, required: false}}
                            placeholder="BIRTH YEAR"
                            value={newBirthYear}
                            onChange={(e) => setNewBirthYear(+e.target.value)}
                        />
                        <Input
                            className="!min-w-[100%] !bg-gray-600 !rounded-lg !text-white !p-2 !mt-3"
                            type="text"
                            inputProps={{required: true}}
                            placeholder="SPECIES"
                            value={newSpecies}
                            onChange={(e) => setNewSpecies(e.target.value)}
                        />
                        <Input
                            className="!min-w-[100%] !bg-gray-600 !rounded-lg !text-white !p-2 !mt-3"
                            type="text"
                            inputProps={{required: true}}
                            placeholder="FAVOURITE FOOD"
                            value={newFavouriteFood}
                            onChange={(e) => setNewFavouriteFood(e.target.value)}
                        />
                        <Input
                            className="!min-w-[100%] !bg-gray-600 !rounded-lg !text-white !p-2 !mt-3"
                            type="text"
                            inputProps={{required: true}}
                            placeholder="COLOR"
                            value={newColor}
                            onChange={(e) => setNewColor(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="min-w-[100%] hover:bg-blue-600 bg-blue-200 hover:text-white hover:rounded-lg !rounded-lg font-bold text-lg mt-3 mb-3"
                        >+</button>
                    </form>
                    <div className="min-w-[70%] flex justify-center items-center">
                        <img src={search} alt="Search" style={{ width: 40, height: 40 }} />
                        <Input
                            className="!min-w-[100%] !bg-gray-600 !rounded-lg !text-white !p-2 !mt-3"
                            placeholder="SEARCH BY NAME"
                            value={searchName}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <AnimalTable data={data} setData={setData} allData={allData} setAllData={setAllData}/>
        </>
    )
}

interface IAnimalStateDto {
    deleteId?: string;
    data: IAnimal[];
    setData: React.Dispatch<React.SetStateAction<IAnimal[]>>
    allData?: IAnimal[]
    setAllData: React.Dispatch<React.SetStateAction<IAnimal[]>>
}

const DeleteButton: FC<IAnimalStateDto> = function ({deleteId, data, setData, setAllData}) {

    const handle = function () {
        const updatedData = data.filter(item => item.id !== deleteId);
        setAllData(updatedData);
    }

    return (
        <Button onClick={handle}>
            Delete me
        </Button>
    )
}

const AnimalTable: FC<IAnimalStateDto> = function ({ data, setData, allData, setAllData }) {

    const [ascending, setAscending] = useState<boolean>(true);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const [animalId, setAnimalId] = useState<string>("");
    const [name, setName] = useState<string>("")
    const [birthYear, setBirthYear] = useState<number | undefined>(0)
    const [species, setSpecies] = useState<string>("");
    const [favouriteFood, setFavouriteFood] = useState<string>("");
    const [color, setColor] = useState<string>("");

    const handleSortByName = function() {
        const sortedData = ascending ?
            data.sort((a: IAnimal, b: IAnimal) => a.name.localeCompare(b.name)) :
            data.sort((a: IAnimal, b: IAnimal) => b.name.localeCompare(a.name));
        setData(sortedData);
        setAscending(!ascending);
    }

    const handleSortByBirthYear = function() {
        const sortedData = ascending ?
            data.sort((a: IAnimal, b: IAnimal) => (a.birthYear ?? Infinity) - (b.birthYear ?? Infinity)) :
            data.sort((a: IAnimal, b: IAnimal) => (b.birthYear ?? -Infinity) - (a.birthYear ?? -Infinity));
        setData(sortedData);
        setAscending(!ascending);
    }

    const handleSortBySpecies = function() {
        const sortedData = ascending ?
            data.sort((a: IAnimal, b: IAnimal) => a.species.localeCompare(b.species)) :
            data.sort((a: IAnimal, b: IAnimal) => b.species.localeCompare(a.species));
        setData(sortedData);
        setAscending(!ascending);
    }

    const handleSortByFavouriteFood = function() {
        const sortedData = ascending ?
            data.sort((a: IAnimal, b: IAnimal) => a.favouriteFood.localeCompare(b.favouriteFood)) :
            data.sort((a: IAnimal, b: IAnimal) => b.favouriteFood.localeCompare(a.favouriteFood));
        setData(sortedData);
        setAscending(!ascending);
    }

    const handleSortByColor = function() {
        const sortedData = ascending ?
            data.sort((a: IAnimal, b: IAnimal) => a.color.localeCompare(b.color)) :
            data.sort((a: IAnimal, b: IAnimal) => b.color.localeCompare(a.color));
        setData(sortedData);
        setAscending(!ascending);
    }

    const editRow = function(row: IAnimal) {
        setAnimalId(row.id)
        setName(row.name)
        setBirthYear(row.birthYear ?? 0)
        setSpecies(row.species)
        setFavouriteFood(row.favouriteFood)
        setColor(row.color)
        openModal();
    }

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);
    const closeModalAndSave = () => {
        if (allData !== undefined) {
            const row: IAnimal = allData.filter(data => data.id === animalId)[0];
            row.name = name;
            row.birthYear = birthYear ?? undefined
            row.species = species
            row.favouriteFood = favouriteFood
            row.color = color
        }
        closeModal();
    }

    return (
        <div className="flex justify-center mt-3">

            <TableContainer className="max-w-[70%]" component={Paper}>
                <Table className="bg-gray-100">
                    <TableHead>
                        <TableRow>
                            <TableCell className="border border-gray-300">
                                <div className="font-bold text-lg flex flex-row items-center">
                                    Name
                                    <img src={sort} alt="sort" style={{width: 20, height: 20}}
                                         onClick={handleSortByName}/>
                                </div>
                            </TableCell>
                            <TableCell className="border border-gray-300">
                                <div className="font-bold text-lg flex flex-row items-center">
                                    Birth Year
                                    <img src={sort} alt="sort" style={{width: 20, height: 20}}
                                         onClick={handleSortByBirthYear}/>
                                </div>
                            </TableCell>
                            <TableCell className="border border-gray-300">
                                <div className="font-bold text-lg flex flex-row items-center">
                                    Species
                                    <img src={sort} alt="sort" style={{width: 20, height: 20}}
                                         onClick={handleSortBySpecies}/>
                                </div>
                            </TableCell>
                            <TableCell className="border border-gray-300">
                                <div className="font-bold text-lg flex flex-row items-center">
                                    Favourite food
                                    <img src={sort} alt="sort" style={{width: 20, height: 20}}
                                         onClick={handleSortByFavouriteFood}/>
                                </div>
                            </TableCell>
                            <TableCell className="border border-gray-300">
                                <div className="font-bold text-lg flex flex-row items-center">
                                    Color
                                    <img src={sort} alt="sort" style={{width: 20, height: 20}}
                                         onClick={handleSortByColor}/>
                                </div>
                            </TableCell>
                            <TableCell className="border border-gray-300">
                                <div className="font-bold text-lg">
                                    Delete
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row: IAnimal) => (
                            <TableRow key={row.id}>
                                <TableCell className="border border-gray-300"
                                           onClick={() => editRow(row)}>{row.name}</TableCell>
                                <TableCell className="border border-gray-300"
                                           onClick={() => editRow(row)}>{row.birthYear ?? 'not known'}</TableCell>
                                <TableCell className="border border-gray-300"
                                           onClick={() => editRow(row)}>{row.species}</TableCell>
                                <TableCell className="border border-gray-300"
                                           onClick={() => editRow(row)}>{row.favouriteFood}</TableCell>
                                <TableCell className="border border-gray-300"
                                           onClick={() => editRow(row)}>{row.color}</TableCell>
                                <TableCell className="border border-gray-300"><DeleteButton data={data}
                                                                                            setData={setData}
                                                                                            setAllData={setAllData}
                                                                                            deleteId={row.id}/></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div>
                <Modal
                    className="bg-gray-200 text-white px-4 py-2 rounded min-w-[50%] min-h-[50%] flex flex-col items-center"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center"
                    isOpen={isOpen}
                    onRequestClose={closeModal}
                >
                    <span className="text-xl text-black font-bold">{"Modify your " + name}</span>
                    <Input
                        className="!min-w-[100%] !bg-gray-600 !rounded-lg !text-white !p-2 !mt-3"
                        type="text"
                        placeholder="NAME"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                        className="!min-w-[100%] !bg-gray-600 !rounded-lg !text-white !p-2 !mt-3"
                        type="number"
                        placeholder="BIRTH YEAR"
                        inputProps={{min: 0}}
                        value={birthYear}
                        onChange={(e) => setBirthYear(+e.target.value)}
                    />
                    <Input
                        className="!min-w-[100%] !bg-gray-600 !rounded-lg !text-white !p-2 !mt-3"
                        type="text"
                        placeholder="SPECIES"
                        value={species}
                        onChange={(e) => setSpecies(e.target.value)}
                    />
                    <Input
                        className="!min-w-[100%] !bg-gray-600 !rounded-lg !text-white !p-2 !mt-3"
                        type="text"
                        placeholder="FAVOURITE FOOD"
                        value={favouriteFood}
                        onChange={(e) => setFavouriteFood(e.target.value)}
                    />
                    <Input
                        className="!min-w-[100%] !bg-gray-600 !rounded-lg !text-white !p-2 !mt-3"
                        type="text"
                        placeholder="NAME"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                    />
                    <button className="min-w-[100%] rounded-lg bg-green-400 text-black hover:text-white hover:bg-green-700 mt-3" onClick={closeModalAndSave}>Save</button>
                </Modal>
            </div>
        </div>
    );
};

export default AnimalDataManager;