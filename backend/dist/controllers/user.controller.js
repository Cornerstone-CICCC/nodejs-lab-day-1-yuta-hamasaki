"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareHash = exports.hashed = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const hashed = (password) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.hash(password, 12);
});
exports.hashed = hashed;
const compareHash = (password, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.compare(password, hashedPassword);
});
exports.compareHash = compareHash;
const getUsers = (req, res) => {
    const users = user_model_1.default.findAll();
    res.json(users);
};
const getUserById = (req, res) => {
    const { id } = req.params;
    const user = user_model_1.default.findById(id);
    if (!user) {
        res.status(404).send('User not found');
        return;
    }
    res.json(user);
};
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, firstname, lastname } = req.body;
    const hashedPassword = yield (0, exports.hashed)(password);
    const user = user_model_1.default.createUser({ username, email, password: hashedPassword, firstname, lastname });
    res.status(201).json(user);
});
const updateUserById = (req, res) => {
    const { id } = req.params;
    const { username, email, firstname, lastname } = req.body;
    const user = user_model_1.default.editUser(id, { username, email, firstname, lastname });
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.status(200).json(user);
};
const deleteUserById = (req, res) => {
    const { id } = req.params;
    const isDeleted = user_model_1.default.deleteUser(id);
    if (!isDeleted) {
        res.status(404).send('User not found');
        return;
    }
    res.status(200).send('User deleted!');
};
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, } = req.body;
    const user = user_model_1.default.findByUsername(username);
    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }
    const isMatch = yield (0, exports.compareHash)(password, user.password);
    if (!isMatch) {
        res.status(401).json({ message: 'Password is invalid ' });
        return;
    }
    res.cookie('isAuthenticated', true, {
        httpOnly: true,
        maxAge: 3 * 60 * 1000,
        signed: true
    });
    res.cookie('userId', user.id, {
        httpOnly: true,
        maxAge: 3 * 60 * 1000,
        signed: true
    });
    res.status(200).json({ message: 'Login authenticated', status: 200 });
});
const userProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.signedCookies.userId;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const user = yield user_model_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const userInfo = {
            id: user.id,
            username: user.username,
            email: user.email,
        };
        res.status(200).json(userInfo);
    }
    catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.default = {
    getUsers,
    getUserById,
    addUser,
    updateUserById,
    deleteUserById,
    loginUser,
    userProfile
};
